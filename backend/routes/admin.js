const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const authMiddleware = require('../middleware/auth')

// Get admin profile (including personal email)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [admins] = await pool.execute(
      'SELECT id, email, personal_email, created_at FROM admins WHERE id = ?',
      [req.admin.id]
    )

    if (admins.length === 0) {
      return res.status(404).json({ error: 'Admin not found' })
    }

    res.json(admins[0])
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update personal email (for OTP recovery)
router.put('/update-email', authMiddleware, async (req, res) => {
  try {
    const { personal_email } = req.body

    if (!personal_email) {
      return res.status(400).json({ error: 'Personal email is required' })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(personal_email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Update personal email
    await pool.execute(
      'UPDATE admins SET personal_email = ? WHERE id = ?',
      [personal_email, req.admin.id]
    )

    console.log(`✅ Personal email updated for admin ID ${req.admin.id}: ${personal_email}`)

    res.json({ 
      success: true, 
      message: 'Personal email updated successfully',
      personal_email 
    })

  } catch (error) {
    console.error('Update email error:', error)
    res.status(500).json({ error: 'Failed to update email' })
  }
})

module.exports = router
