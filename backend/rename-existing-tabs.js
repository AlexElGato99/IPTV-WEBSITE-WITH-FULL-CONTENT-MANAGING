const mysql = require('mysql2/promise');
require('dotenv').config();

async function renameExistingTabs() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iptv_database'
  });

  try {
    console.log('Connected to MySQL database');
    console.log('\nRenaming existing device tabs...\n');

    // Rename tab "1" to "1 Device"
    const [result1] = await connection.query(
      'UPDATE plans SET device_tab = ? WHERE device_tab = ?',
      ['1 Device', '1']
    );
    console.log(`✓ Renamed "1" to "1 Device" (${result1.affectedRows} plans updated)`);

    // Rename tab "2" to "2 Devices"
    const [result2] = await connection.query(
      'UPDATE plans SET device_tab = ? WHERE device_tab = ?',
      ['2 Devices', '2']
    );
    console.log(`✓ Renamed "2" to "2 Devices" (${result2.affectedRows} plans updated)`);

    // Rename tab "3" to "3 Devices"
    const [result3] = await connection.query(
      'UPDATE plans SET device_tab = ? WHERE device_tab = ?',
      ['3 Devices', '3']
    );
    console.log(`✓ Renamed "3" to "3 Devices" (${result3.affectedRows} plans updated)`);

    // Rename tab "6" to "6 Devices"
    const [result6] = await connection.query(
      'UPDATE plans SET device_tab = ? WHERE device_tab = ?',
      ['6 Devices', '6']
    );
    console.log(`✓ Renamed "6" to "6 Devices" (${result6.affectedRows} plans updated)`);

    console.log('\n✅ All device tabs renamed successfully!');
    console.log('\nNew tab names:');
    console.log('  • 1 Device');
    console.log('  • 2 Devices');
    console.log('  • 3 Devices');
    console.log('  • 6 Devices');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

renameExistingTabs();
