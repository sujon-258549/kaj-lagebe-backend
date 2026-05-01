import nodemailer from 'nodemailer';
import config from '../config/index.ts';

export const otpEmailTemplate = (data: { name?: string; otp: number }) => {
  const userName = data.name || 'User';
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .otp-box { background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset OTP</h2>
        <p>Hello ${userName},</p>
        <p>You requested to reset your password. Use the following OTP code:</p>
        <div class="otp-box">
          <div class="otp-code">${data.otp}</div>
        </div>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

export const contactAcknowledgmentTemplate = (data: {
  name: string;
  subject: string;
  aiMessage: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #4F46E5; text-decoration: none; }
        .content { font-size: 16px; color: #4b5563; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
        .ai-response { background: #f3f4f6; border-left: 4px solid #4F46E5; padding: 20px; margin: 20px 0; border-radius: 4px; font-style: italic; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white !important; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">KajLagbe</a>
        </div>
        <div class="content">
          <h2 style="color: #1f2937;">Hello ${data.name},</h2>
          <p>Thank you for reaching out to us! We have received your message regarding <strong>"${data.subject}"</strong>.</p>
          
          <div class="ai-response">
            ${data.aiMessage}
          </div>
          
          <p>Our team has been notified and we will get back to you if further assistance is needed. In the meantime, feel free to explore our platform.</p>
          
          <div style="text-align: center;">
            <a href="https://kajlagbe.com" class="btn">Visit Website</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2026 KajLagbe. All rights reserved.</p>
          <p>This is an automated response. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};


export const adminContactNotificationTemplate = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border-top: 4px solid #ef4444; border-radius: 8px; }
        .header { margin-bottom: 20px; color: #1f2937; }
        .detail-row { margin-bottom: 15px; padding: 10px; background: #f9fafb; border-radius: 4px; }
        .label { font-weight: bold; color: #4b5563; display: block; margin-bottom: 5px; }
        .value { color: #111827; }
        .message-box { margin-top: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 4px; }
        .footer { margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🚀 New Contact Inquiry Received</h2>
          <p>A new visitor has reached out through the contact form.</p>
        </div>
        
        <div class="detail-row">
          <span class="label">Name:</span>
          <span class="value">${data.name}</span>
        </div>
        
        <div class="detail-row">
          <span class="label">Email:</span>
          <span class="value">${data.email}</span>
        </div>
        
        <div class="detail-row">
          <span class="label">Subject:</span>
          <span class="value">${data.subject}</span>
        </div>
        
        <div class="message-box">
          <span class="label">Message:</span>
          <p class="value">${data.message}</p>
        </div>
        
        <div class="footer">
          <p>This is an automated notification from your Website Dashboard.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendEmail = async (to: string, html: string, subject?: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.nodeEnv === 'production', // true for port 465, false for other ports
    auth: {
      user: 'mdsujon258549@gmail.com',
      pass: 'zxyr hvfh yhat mree',
    },
  });
  const result = await transporter.sendMail({
    from: 'mdsujon258549@gmail.com', // sender address
    to: to, // list of receivers
    subject: subject || 'Place change your Password ✔', // Subject line
    text: 'Hi there We received a request to reset your password. If you did not make this request, you can safely ignore this email.To reset your password, please click the link below:',
    html: html, // html body
  });
  return result;
};