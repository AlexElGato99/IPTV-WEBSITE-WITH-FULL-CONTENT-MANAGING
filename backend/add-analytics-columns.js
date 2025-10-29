const mysql = require('mysql2/promise');
require('dotenv').config();

async function addAnalyticsColumns() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iptv_database'
  });

  try {
    console.log('Connected to MySQL database');

    // Check if columns exist
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'settings' AND COLUMN_NAME IN ('google_analytics_id', 'google_analytics_measurement_id')
    `, [process.env.DB_NAME || 'iptv_database']);

    const existingColumns = columns.map(c => c.COLUMN_NAME);

    if (!existingColumns.includes('google_analytics_id')) {
      await connection.query(`
        ALTER TABLE settings 
        ADD COLUMN google_analytics_id VARCHAR(255) NULL AFTER whatsapp_number
      `);
      console.log('✓ Added google_analytics_id column');
    } else {
      console.log('✓ google_analytics_id column already exists');
    }

    if (!existingColumns.includes('google_analytics_measurement_id')) {
      await connection.query(`
        ALTER TABLE settings 
        ADD COLUMN google_analytics_measurement_id VARCHAR(255) NULL AFTER google_analytics_id
      `);
      console.log('✓ Added google_analytics_measurement_id column');
    } else {
      console.log('✓ google_analytics_measurement_id column already exists');
    }

    console.log('\n✅ Analytics columns setup complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

addAnalyticsColumns();
