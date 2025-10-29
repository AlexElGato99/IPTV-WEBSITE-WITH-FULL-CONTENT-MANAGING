const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const pool = require('../config/database')
const rateLimit = require('express-rate-limit')
const { sendOtpEmail } = require('../utils/emailService')

// Rate limiting for password reset requests
const resetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 requests per window
  message: { error: 'Too many password reset requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

const resetVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 verification attempts
  message: { error: 'Too many verification attempts. Please request a new OTP.' },
  standardHeaders: true,
  legacyHeaders: false
})

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Request password reset (send OTP)
router.post('/forgot-password', resetRequestLimiter, async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    // Check if admin exists and get their personal email
    const [admins] = await pool.execute(
      'SELECT id, email, personal_email FROM admins WHERE email = ?',
      [email]
    )

    if (admins.length === 0) {
      // Don't reveal if email exists (security best practice)
      return res.json({ 
        success: true, 
        message: 'If this email is registered, you will receive an OTP code.' 
      })
    }

    const admin = admins[0]
    const sendToEmail = admin.personal_email || admin.email // Use personal email if set, otherwise login email

    // Generate OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete old OTPs for this email
    await pool.execute(
      'DELETE FROM password_resets WHERE email = ?',
      [email]
    )

    // Store OTP in database
    await pool.execute(
      'INSERT INTO password_resets (email, otp, expires_at) VALUES (?, ?, ?)',
      [email, otp, expiresAt]
    )

    // Send OTP email to personal email address
    try {
      await sendOtpEmail(sendToEmail, otp)
      console.log(`✅ OTP sent to ${sendToEmail} (for ${email}): ${otp}`) // Remove in production
    } catch (emailError) {
      console.error('Email send error:', emailError)
      return res.status(500).json({ 
        error: 'Failed to send OTP email. Please check email configuration.' 
      })
    }

    res.json({ 
      success: true, 
      message: 'OTP code sent to your email. Please check your inbox.' 
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

// Verify OTP and reset password
router.post('/reset-password', resetVerifyLimiter, async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, OTP, and new password are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' })
    }

    // Find valid OTP
    const [otpRecords] = await pool.execute(
      'SELECT * FROM password_resets WHERE email = ? AND otp = ? AND used = FALSE AND expires_at > NOW()',
      [email, otp]
    )

    if (otpRecords.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP code' })
    }

    // Check if admin exists
    const [admins] = await pool.execute(
      'SELECT id FROM admins WHERE email = ?',
      [email]
    )

    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin account not found' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await pool.execute(
      'UPDATE admins SET password_hash = ? WHERE email = ?',
      [hashedPassword, email]
    )

    // Mark OTP as used
    await pool.execute(
      'UPDATE password_resets SET used = TRUE WHERE email = ? AND otp = ?',
      [email, otp]
    )

    console.log(`✅ Password reset successful for ${email}`)

    res.json({ 
      success: true, 
      message: 'Password reset successfully. You can now login with your new password.' 
    })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Server error. Please try again later.' })
  }
})

module.exports = router
