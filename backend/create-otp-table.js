require('dotenv').config()
const mysql = require('mysql2/promise')

async function createOtpTable() {
  let connection
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'iptv_database'
    })

    console.log('✅ Connected to database')

    // Create password_resets table for storing OTPs
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(6) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `

    await connection.execute(createTableQuery)
    console.log('✅ password_resets table created successfully')

    // Clean up old/expired OTPs
    const cleanupQuery = `
      DELETE FROM password_resets 
      WHERE expires_at < NOW() OR used = TRUE
    `
    await connection.execute(cleanupQuery)
    console.log('✅ Cleaned up old OTP records')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    if (connection) await connection.end()
  }
}

createOtpTable()
