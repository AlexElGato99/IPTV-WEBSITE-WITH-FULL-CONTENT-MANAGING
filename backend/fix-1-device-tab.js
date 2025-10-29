const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix1DeviceTab() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iptv_database'
  });

  try {
    console.log('Connected to MySQL database');
    console.log('\nFixing "1 alex" tab name...\n');

    const [result] = await connection.query(
      'UPDATE plans SET device_tab = ? WHERE device_tab = ?',
      ['1 Device', '1 alex']
    );
    
    console.log(`✓ Renamed "1 alex" to "1 Device" (${result.affectedRows} plans updated)`);
    console.log('\n✅ Tab name fixed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

fix1DeviceTab();
