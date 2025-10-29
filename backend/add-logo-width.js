const mysql = require('mysql2/promise');
require('dotenv').config();

async function addLogoWidth() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'iptv_database'
    });

    console.log('Connected to database...');

    // Add logo_width column to settings table
    await connection.execute(`
      ALTER TABLE settings 
      ADD COLUMN logo_width INT DEFAULT 150 
      COMMENT 'Logo width in pixels'
    `);

    console.log('✅ logo_width column added successfully to settings table');

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️  logo_width column already exists');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    if (connection) await connection.end();
  }
}

addLogoWidth();
