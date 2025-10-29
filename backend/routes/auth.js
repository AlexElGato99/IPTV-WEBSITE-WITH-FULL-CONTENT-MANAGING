const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/database');
const { sendPasswordResetEmail } = require('../utils/emailService');
const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find admin by email
    const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email.toLowerCase().trim()]);
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Check auth status
router.get('/check', async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ 
      authenticated: true,
      admin: {
        id: decoded.id,
        email: decoded.email
      }
    });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

// Password recovery - reset to default if email unchanged, else send email
router.post('/recover-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Find admin by email
    const [admins] = await db.query('SELECT * FROM admins WHERE email = ?', [email.toLowerCase().trim()])
    
    if (admins.length === 0) {
      // Don't reveal if email exists (security)
      return res.json({ 
        success: true, 
        message: 'If this email exists, recovery instructions have been sent.' 
      })
    }

    const admin = admins[0]
    const defaultEmail = 'admin@site.com'

    // Check if still using default email
    if (admin.email.toLowerCase() === defaultEmail.toLowerCase()) {
      // Reset to default password: admin123
      const defaultPasswordHash = await bcrypt.hash('admin123', 10)
      
      await db.query(
        'UPDATE admins SET password_hash = ? WHERE id = ?',
        [defaultPasswordHash, admin.id]
      )

      console.log(`✅ Password reset to default for: ${admin.email}`)

      return res.json({
        success: true,
        message: 'Password has been reset to: admin123',
        isDefaultEmail: true
      })
    } else {
      // Email has been changed - send reset email
      console.log(`📧 Sending password reset email to: ${admin.email}`)
      
      try {
        // Generate unique reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        
        // Token expires in 1 hour
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        
        // Store token in database
        await db.query(
          'INSERT INTO password_resets (admin_id, token, expires_at) VALUES (?, ?, ?)',
          [admin.id, resetToken, expiresAt]
        )
        
        // Send email with reset link
        await sendPasswordResetEmail(admin.email, resetToken)
        
        console.log(`✅ Password reset email sent successfully to: ${admin.email}`)
        
        return res.json({
          success: true,
          message: `Password reset link has been sent to ${admin.email}. Please check your email.`,
          isDefaultEmail: false
        })
      } catch (emailError) {
        console.error('❌ Failed to send reset email:', emailError.message)
        
        return res.status(500).json({
          error: 'Failed to send reset email. Please check email configuration or contact administrator.',
          details: emailError.message
        })
      }
    }

  } catch (error) {
    console.error('Password recovery error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params

    const [resets] = await db.query(
      `SELECT pr.*, a.email 
       FROM password_resets pr 
       JOIN admins a ON pr.admin_id = a.id 
       WHERE pr.token = ? AND pr.used = FALSE AND pr.expires_at > NOW()`,
      [token]
    )

    if (resets.length === 0) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Invalid or expired reset token' 
      })
    }

    res.json({ 
      valid: true, 
      email: resets[0].email 
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    // Find valid reset token
    const [resets] = await db.query(
      `SELECT pr.*, a.id as admin_id 
       FROM password_resets pr 
       JOIN admins a ON pr.admin_id = a.id 
       WHERE pr.token = ? AND pr.used = FALSE AND pr.expires_at > NOW()`,
      [token]
    )

    if (resets.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid or expired reset token. Please request a new password reset.' 
      })
    }

    const reset = resets[0]

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update password
    await db.query(
      'UPDATE admins SET password_hash = ? WHERE id = ?',
      [passwordHash, reset.admin_id]
    )

    // Mark token as used
    await db.query(
      'UPDATE password_resets SET used = TRUE WHERE id = ?',
      [reset.id]
    )

    console.log(`✅ Password reset successfully for admin ID: ${reset.admin_id}`)

    res.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now login with your new password.' 
    })
  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router;
