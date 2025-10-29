const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const pool = require('../config/database')
const authMiddleware = require('../middleware/auth')

// Get current admin account info
router.get('/info', authMiddleware, async (req, res) => {
  try {
    const [admins] = await pool.execute(
      'SELECT id, email, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    )

    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    res.json(admins[0])
  } catch (error) {
    console.error('Get account info error:', error)
    res.status(500).json({ error: 'Failed to fetch account information' })
  }
})

// Update admin email
router.put('/update-email', authMiddleware, async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body

    // Validation
    if (!newEmail || !currentPassword) {
      return res.status(400).json({ error: 'New email and current password are required' })
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Get current admin data
    const [admins] = await pool.execute(
      'SELECT id, email, password_hash FROM admins WHERE id = ?',
      [req.admin.id]
    )

    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    const admin = admins[0]

    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!passwordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Check if new email already exists
    const [existingEmail] = await pool.execute(
      'SELECT id FROM admins WHERE email = ? AND id != ?',
      [newEmail, req.admin.id]
    )

    if (existingEmail.length > 0) {
      return res.status(400).json({ error: 'Email already in use' })
    }

    // Update email
    await pool.execute(
      'UPDATE admins SET email = ? WHERE id = ?',
      [newEmail, req.admin.id]
    )

    console.log(`✅ Email updated from ${admin.email} to ${newEmail}`)

    res.json({ 
      success: true, 
      message: 'Email updated successfully. Please login with your new email.',
      newEmail 
    })

  } catch (error) {
    console.error('Update email error:', error)
    res.status(500).json({ error: 'Failed to update email' })
  }
})

// Change password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'All password fields are required' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match' })
    }

    // Get current admin data
    const [admins] = await pool.execute(
      'SELECT id, email, password_hash FROM admins WHERE id = ?',
      [req.admin.id]
    )

    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    const admin = admins[0]

    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, admin.password_hash)
    if (!passwordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await pool.execute(
      'UPDATE admins SET password_hash = ? WHERE id = ?',
      [hashedPassword, req.admin.id]
    )

    console.log(`✅ Password changed for admin: ${admin.email}`)

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    })

  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Failed to change password' })
  }
})

module.exports = router
