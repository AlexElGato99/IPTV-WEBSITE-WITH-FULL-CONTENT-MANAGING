const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDeviceTabColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iptv_database'
  });

  try {
    console.log('Connected to MySQL database');

    // Check current column type
    const [columns] = await connection.query(`
      SELECT COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'plans' AND COLUMN_NAME = 'device_tab'
    `, [process.env.DB_NAME || 'iptv_database']);

    if (columns.length > 0) {
      console.log('Current device_tab type:', columns[0].COLUMN_TYPE);
      
      // Change from ENUM to VARCHAR to allow custom device tabs
      await connection.query(`
        ALTER TABLE plans 
        MODIFY COLUMN device_tab VARCHAR(50) NOT NULL
      `);
      console.log('✓ Changed device_tab from ENUM to VARCHAR(50)');
    }

    console.log('\n✅ Device tab column updated successfully!');
    console.log('You can now add custom device tabs like "5", "10", etc.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateDeviceTabColumn();
