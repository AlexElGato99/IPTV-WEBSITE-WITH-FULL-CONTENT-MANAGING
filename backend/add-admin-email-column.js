require('dotenv').config()
const mysql = require('mysql2/promise')

async function addAdminEmailColumn() {
  let connection
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'iptv_database'
    })

    console.log('✅ Connected to database')

    // Check if column exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'admins' 
      AND COLUMN_NAME = 'personal_email'
    `, [process.env.DB_NAME || 'iptv_database'])

    if (columns.length > 0) {
      console.log('ℹ️  personal_email column already exists')
      return
    }

    // Add personal_email column to admins table
    await connection.execute(`
      ALTER TABLE admins 
      ADD COLUMN personal_email VARCHAR(255) DEFAULT NULL COMMENT 'Personal email for OTP recovery'
    `)

    console.log('✅ personal_email column added to admins table')

    // Update existing admin with their login email as default
    await connection.execute(`
      UPDATE admins 
      SET personal_email = email 
      WHERE personal_email IS NULL
    `)

    console.log('✅ Updated existing admin with default personal email')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    if (connection) await connection.end()
  }
}

addAdminEmailColumn()
