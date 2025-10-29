const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateFeatures() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // Get all plans
    const [plans] = await connection.execute('SELECT id, name, features FROM plans');
    
    console.log('📋 Current plans with features:');
    plans.forEach(plan => {
      console.log(`\nPlan: ${plan.name}`);
      console.log(`Features: ${plan.features}`);
    });

    // Update features: Remove " with EPG" from all plans
    for (const plan of plans) {
      if (plan.features && plan.features.includes('with EPG')) {
        const oldFeatures = plan.features;
        const newFeatures = oldFeatures.replace(/ with EPG/g, '');
        
        await connection.execute(
          'UPDATE plans SET features = ? WHERE id = ?',
          [newFeatures, plan.id]
        );
        
        console.log(`\n✅ Updated plan: ${plan.name}`);
        console.log(`Old: ${oldFeatures}`);
        console.log(`New: ${newFeatures}`);
      }
    }

    console.log('\n✅ All features updated successfully!');

  } catch (error) {
    console.error('❌ Error updating features:', error);
  } finally {
    await connection.end();
  }
}

updateFeatures();
