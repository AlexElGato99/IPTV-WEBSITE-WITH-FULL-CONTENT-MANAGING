const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkCurrentTabs() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iptv_database'
  });

  try {
    console.log('Connected to MySQL database');
    console.log('\nCurrent device tabs in database:\n');

    const [tabs] = await connection.query('SELECT DISTINCT device_tab FROM plans ORDER BY device_tab');
    
    if (tabs.length === 0) {
      console.log('No tabs found in database.');
    } else {
      tabs.forEach((row, index) => {
        console.log(`${index + 1}. "${row.device_tab}"`);
      });
    }

    console.log('\n---\n');
    
    // Show count of plans per tab
    const [counts] = await connection.query(`
      SELECT device_tab, COUNT(*) as plan_count 
      FROM plans 
      GROUP BY device_tab 
      ORDER BY device_tab
    `);
    
    console.log('Plans per tab:');
    counts.forEach(row => {
      console.log(`  "${row.device_tab}": ${row.plan_count} plan(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkCurrentTabs();
