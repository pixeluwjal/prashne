// src/utils/mailer.ts
import nodemailer from 'nodemailer';

// This check ensures your .env file is being read correctly
if (!process.env.EMAIL_SERVER_HOST || !process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
  throw new Error('Missing required Gmail environment variables for Nodemailer.');
}

// Create a reusable transporter object using the configuration from .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // For port 587, secure must be false (uses STARTTLS)
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// A reusable function to send the verification email
export const sendVerificationEmail = async (to: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Your Prashne Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333; padding: 20px;">
        <h2 style="color: #0056b3;">Welcome to Prashne!</h2>
        <p style="font-size: 16px;">Your one-time verification code is:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 5px; background: #f0f8ff; padding: 15px 20px; border-radius: 8px; border: 1px solid #cce7ff; display: inline-block; margin: 20px 0;">
          ${code}
        </p>
        <p style="font-size: 14px; color: #777;">This code will expire in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to: ${to}`);
  } catch (error) {
    console.error(`❌ Error sending verification email:`, error);
    throw new Error('Could not send verification email.');
  }
};