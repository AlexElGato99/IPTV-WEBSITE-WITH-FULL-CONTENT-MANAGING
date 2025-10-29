const mysql = require('mysql2/promise');
require('dotenv').config();

async function createPasswordResetTable() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('📦 Connected to database');

    // Drop existing table if it exists
    await connection.query('DROP TABLE IF EXISTS password_resets');
    console.log('🗑️  Dropped existing password_resets table (if any)');

    // Create password_resets table
    const createTableQuery = `
      CREATE TABLE password_resets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        admin_id INT NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        INDEX idx_token (token),
        INDEX idx_expires (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.query(createTableQuery);
    console.log('✅ password_resets table created successfully!');

    console.log('\n📋 Table Structure:');
    console.log('   - id: Auto-increment primary key');
    console.log('   - admin_id: Reference to admins table');
    console.log('   - token: Unique reset token (UUID)');
    console.log('   - expires_at: Token expiration time (1 hour)');
    console.log('   - used: Whether token has been used');
    console.log('   - created_at: When token was created');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

createPasswordResetTable();
