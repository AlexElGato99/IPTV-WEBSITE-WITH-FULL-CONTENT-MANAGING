const nodemailer = require('nodemailer')

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  })
}

// Send OTP email
async function sendOtpEmail(email, otp) {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'IPTV Admin <noreply@yoursite.com>',
      to: email,
      subject: 'Password Reset - OTP Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #86ff00; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: #fff; border: 2px solid #86ff00; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #1a1a1a; letter-spacing: 8px; }
            .warning { color: #ff4444; font-size: 14px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for the IPTV Admin Panel. Use the OTP code below to reset your password:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>This code will expire in 10 minutes.</strong></p>
              
              <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
              
              <div class="warning">
                <strong>⚠ Security Notice:</strong> For security reasons, never share this code with anyone.
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} IPTV Admin Panel. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ OTP email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email send error:', error)
    throw new Error('Failed to send OTP email')
  }
}

// Send password reset link
async function sendPasswordResetEmail(email, resetToken) {
  try {
    const transporter = createTransporter()
    
    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'IPTV Admin <noreply@yoursite.com>',
      to: email,
      subject: 'Password Reset Request - IPTV Admin Panel',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #86ff00; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button-box { text-align: center; margin: 30px 0; }
            .reset-button { 
              display: inline-block;
              background: #86ff00; 
              color: #1a1a1a; 
              padding: 15px 40px; 
              text-decoration: none; 
              border-radius: 8px; 
              font-weight: bold;
              font-size: 16px;
            }
            .reset-button:hover { background: #75e600; }
            .warning { color: #ff4444; font-size: 14px; margin-top: 20px; background: #fff; padding: 15px; border-left: 4px solid #ff4444; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .alt-link { word-break: break-all; color: #666; font-size: 12px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for the IPTV Admin Panel. Click the button below to create a new password:</p>
              
              <div class="button-box">
                <a href="${resetLink}" class="reset-button">Reset My Password</a>
              </div>
              
              <p><strong>This link will expire in 1 hour.</strong></p>
              
              <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
              
              <div class="warning">
                <strong>⚠ Security Notice:</strong> For security reasons, never share this link with anyone. This is a one-time use link.
              </div>
              
              <p class="alt-link">If the button doesn't work, copy and paste this link into your browser:<br>${resetLink}</p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} IPTV Admin Panel. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Password reset email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email send error:', error)
    throw new Error('Failed to send password reset email: ' + error.message)
  }
}

// Test email configuration
async function testEmailConfig() {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('✅ Email configuration is valid')
    return true
  } catch (error) {
    console.error('❌ Email configuration error:', error.message)
    return false
  }
}

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
  testEmailConfig
}
