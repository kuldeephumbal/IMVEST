const nodemailer = require('nodemailer');

// Configure email transporter (you'll need to   set up your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

// Send OTP email (for testing - returns OTP in response)
async function sendOTPEmail(email, otp, userType, userName) {
  try {
    // For testing purposes, we'll simulate email sending
    console.log(`📧 [TEST MODE] OTP Email would be sent to: ${email}`);
    console.log(`📧 [TEST MODE] OTP Code: ${otp}`);
    console.log(`📧 [TEST MODE] User Type: ${userType}`);
    console.log(`📧 [TEST MODE] User Name: ${userName}`);
    
    // In production, uncomment the email sending code below
    /*
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@imvest.com',
      to: email,
      subject: 'IMVEST - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #09333F 0%, #44C0C5 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">IMVEST</h1>
            <p style="color: white; margin: 5px 0;">Password Reset Request</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #09333F;">Hello ${userName || 'there'},</h2>
            
            <p>We received a password reset request for your IMVEST ${userType} account.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #44C0C5; margin: 0;">Your OTP Code</h3>
              <div style="font-size: 32px; font-weight: bold; color: #09333F; letter-spacing: 5px; margin: 15px 0;">
                ${otp}
              </div>
              <p style="color: #666; margin: 0;">This code will expire in 10 minutes</p>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP is valid for 10 minutes only</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
            
            <p>If you have any questions, please contact our support team.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>The IMVEST Team</strong>
            </p>
          </div>
          
          <div style="background: #09333F; padding: 15px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">
              © 2024 IMVEST. All rights reserved.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    */
    
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  sendOTPEmail,
  generateOTP
}; 