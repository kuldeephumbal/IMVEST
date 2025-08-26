require('dotenv').config();
const { sendOTPEmail, generateOTP } = require('../utils/emailService');

async function testEmail() {
  console.log('🧪 Testing Email Configuration');
  console.log('==============================\n');

  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
  console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('\n❌ Email credentials not configured!');
    console.log('Please update your .env file with:');
    console.log('EMAIL_USER=your-gmail@gmail.com');
    console.log('EMAIL_PASSWORD=your-16-character-app-password');
    return;
  }

  // Generate test OTP
  const testOTP = generateOTP();
  const testEmail = process.env.EMAIL_USER; // Send to yourself for testing

  console.log(`\n📧 Sending test email to: ${testEmail}`);
  console.log(`🔑 Test OTP: ${testOTP}`);

  try {
    const result = await sendOTPEmail(testEmail, testOTP, 'admin', 'Test User');
    
    if (result) {
      console.log('\n✅ Email sent successfully!');
      console.log('📬 Check your inbox for the test email');
      console.log('🔍 Look for subject: "IMVEST - Password Reset OTP"');
    } else {
      console.log('\n❌ Email sending failed!');
      console.log('🔧 Check your Gmail App Password configuration');
      console.log('📖 See docs/GMAIL_SETUP.md for troubleshooting');
    }
  } catch (error) {
    console.log('\n❌ Email test failed with error:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Authentication Error - Check your App Password');
      console.log('1. Ensure 2FA is enabled on your Gmail account');
      console.log('2. Generate a new App Password for "Mail"');
      console.log('3. Use the 16-character App Password (not regular password)');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Connection Error - Check your internet and Gmail settings');
    }
  }
}

// Run the test
testEmail().catch(console.error); 