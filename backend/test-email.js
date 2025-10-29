const { testEmailConfig, sendPasswordResetEmail } = require('./utils/emailService');
require('dotenv').config();

async function testEmail() {
  console.log('🧪 Testing Email Configuration...\n');
  
  console.log('📧 Email Settings:');
  console.log(`   Host: ${process.env.EMAIL_HOST || 'NOT SET'}`);
  console.log(`   Port: ${process.env.EMAIL_PORT || 'NOT SET'}`);
  console.log(`   User: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`   Password: ${process.env.EMAIL_PASSWORD ? '****' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET'}`);
  console.log(`   From: ${process.env.EMAIL_FROM || 'NOT SET'}\n`);

  // Test connection
  console.log('🔌 Testing SMTP connection...');
  const isValid = await testEmailConfig();
  
  if (!isValid) {
    console.log('\n❌ Email configuration is invalid!');
    console.log('\n📝 To fix this:');
    console.log('1. Go to https://myaccount.google.com/apppasswords');
    console.log('2. Enable 2-Step Verification if not already enabled');
    console.log('3. Create a new App Password for "Mail"');
    console.log('4. Copy the 16-character password');
    console.log('5. Update EMAIL_USER and EMAIL_PASSWORD in your .env file');
    console.log('6. Run this test again\n');
    process.exit(1);
  }
  
  console.log('\n✅ Email configuration is valid!\n');
  
  // Ask if user wants to send test email
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Would you like to send a test password reset email? (yes/no): ', async (answer) => {
    if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
      readline.question('Enter email address to send test to: ', async (testEmail) => {
        try {
          console.log(`\n📤 Sending test email to ${testEmail}...`);
          const testToken = 'test-token-' + Date.now();
          await sendPasswordResetEmail(testEmail, testToken);
          console.log('✅ Test email sent successfully!');
          console.log(`\nTest reset link: ${process.env.FRONTEND_URL}/admin/reset-password?token=${testToken}`);
        } catch (error) {
          console.error('❌ Failed to send test email:', error.message);
        } finally {
          readline.close();
        }
      });
    } else {
      console.log('👍 Skipping test email send');
      readline.close();
    }
  });
}

testEmail();
