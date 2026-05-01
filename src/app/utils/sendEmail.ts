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
          <a href="#" class="logo">কাজলাগবে</a>
        </div>
        <div class="content">
          <h2 style="color: #1f2937;">প্রিয় ${data.name},</h2>
          <p>আমাদের সাথে যোগাযোগ করার জন্য ধন্যবাদ! আমরা আপনার বার্তাটি পেয়েছি: <strong>"${data.subject}"</strong>।</p>
          
          <div class="ai-response">
            ${data.aiMessage}
          </div>
          
          <p>আমাদের টিম আপনার বার্তাটি পর্যালোচনা করছে এবং প্রয়োজন হলে আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব। আমাদের প্ল্যাটফর্মের সাথেই থাকুন।</p>
          
          <div style="text-align: center;">
            <a href="https://kajlagbe.com" class="btn">ওয়েবসাইট ভিজিট করুন</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2026 কাজলাগবে। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>এটি একটি স্বয়ংক্রিয় বার্তা। অনুগ্রহ করে এই ইমেইলের সরাসরি উত্তর দেবেন না।</p>
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

export const contactFeedbackTemplate = (data: {
  name: string;
  originalMessage: string;
  feedbackMessage: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f8fafc; margin: 0; padding: 0; }
        .wrapper { padding: 40px 20px; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 30px; text-align: center; color: white; }
        .logo { font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 8px; display: block; color: white; text-decoration: none; }
        .header-title { font-size: 20px; font-weight: 600; margin: 0; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 24px; }
        .response-box { background: #f1f5f9; border-radius: 12px; padding: 24px; margin: 24px 0; border-left: 4px solid #4F46E5; }
        .response-text { font-size: 16px; color: #334155; margin: 0; white-space: pre-wrap; }
        .original-context { margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; }
        .context-title { font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
        .original-message { font-size: 14px; color: #94a3b8; font-style: italic; margin: 0; }
        .footer { padding: 30px; background: #f1f5f9; text-align: center; font-size: 14px; color: #64748b; }
        .social-links { margin-bottom: 16px; }
        .social-link { color: #4F46E5; text-decoration: none; margin: 0 10px; font-weight: 600; }
        .btn { display: inline-block; padding: 12px 28px; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 24px; transition: background-color 0.2s; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <a href="https://kajlagbe.com" class="logo">কাজলাগবে</a>
            <p class="header-title">অফিসিয়াল রেসপন্স</p>
          </div>
          <div class="content">
            <h1 class="greeting">প্রিয় ${data.name},</h1>
            <p>আমাদের সাথে যোগাযোগ করার জন্য ধন্যবাদ। আমরা আপনার বার্তাটি পর্যালোচনা করেছি এবং আমাদের টিমের পক্ষ থেকে নিচের উত্তরটি প্রদান করা হয়েছে:</p>
            
            <div class="response-box">
              <p class="response-text">${data.feedbackMessage}</p>
            </div>
            
            <p>আপনার যদি আরও কোনো প্রশ্ন থাকে বা সাহায্যের প্রয়োজন হয়, তবে নির্দ্বিধায় আমাদের সাথে পুনরায় যোগাযোগ করুন।</p>
            
            <div style="text-align: center;">
              <a href="https://kajlagbe.com" class="btn">আমাদের ওয়েবসাইট ভিজিট করুন</a>
            </div>

            <div class="original-context">
              <p class="context-title">আপনার মূল বার্তা</p>
              <p class="original-message">"${data.originalMessage}"</p>
            </div>
          </div>
          <div class="footer">
            <div class="social-links">
              <a href="#" class="social-link">ফেসবুক</a>
              <a href="#" class="social-link">টুইটার</a>
              <a href="#" class="social-link">লিঙ্কডইন</a>
            </div>
            <p>&copy; 2026 কাজলাগবে। সর্বস্বত্ব সংরক্ষিত।</p>
            <p>পেশাদারিত্ব এবং আস্থার সাথে আপনার পাশে।</p>
          </div>
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