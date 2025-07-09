import nodemailer from 'nodemailer';

const emailSender = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASS;

const htmlTemplate = (title, content) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; padding: 0; background: white; border-radius: 8px; }
          .header { text-align: center; background: #E6002D; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header img { max-width: 100px; height: auto; margin-bottom: 15px; border-radius: 50%; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .content { padding: 20px; background: white; color: #333; }
          .news-card { border: 1px solid #e2e8f0; border-radius: 0.375rem; margin-bottom: 1rem; }
          .news-title { font-size: 1.125rem; font-weight: bold; color: #1a202c; margin-bottom: 0.5rem; }
          .news-date { font-size: 0.875rem; color: #718096; }
          .button { background: #E6002D; color: white; padding: 0.75rem 1rem; text-decoration: none; border-radius: 0.25rem; display: inline-block; font-weight: 600; }
          .button:hover { background: #cc0028; }
          .footer { text-align: center; padding: 1.25rem; background: #1a202c; color: white; border-radius: 0 0 8px 8px; }
          .comment-section { padding: 1rem; border-top: 1px solid #e2e8f0; }
          .comment { padding: 1rem; border-bottom: 1px solid #e2e8f0; }
          .comment-author { font-weight: bold; color: #1a202c; }
          .comment-text { color: #4a5568; margin-top: 0.5rem; }
          @media only screen and (max-width: 600px) {
              .container { margin: 10px; }
              .content { padding: 1rem; }
          }
      </style>
    </head>
    <body>
      <div class="container">
          <div class="header">
              <img src="https://newsfy-nine.vercel.app/logo.jpg" alt="Newsfy Logo" style="max-width: 100px; border-radius: 50%;"/>
          </div>
          <div class="content">
              ${content}
              <div style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
                <p style="color: #4a5568; font-size: 14px;">
                  Regards,<br>
                  Newsfy Team
                </p>
              </div>
          </div>
          <div class="footer">
              <p style="margin: 0; font-size: 12px;">© 2025 Newsfy. All rights reserved.</p>
              <p style="margin-top: 10px; font-size: 12px;">Copyright 2025 by Amina Hassan & Munira Zubery</p>
          </div>
      </div>
    </body>
  </html>`;

const sendEmail = async (subject, content, emailReceivers, senderName) => {
    if (!emailSender || !emailPassword) {
        console.log("❌ Email credentials are missing. Please check your environment variables.");
        return false;
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: emailSender,
        pass: emailPassword
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const receivers = Array.isArray(emailReceivers) ? emailReceivers : [emailReceivers];

    const mailOptions = {
        from: `${senderName} <${emailSender}>`,
        bcc: receivers,
        subject: subject,
        html: htmlTemplate(subject, content),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully to", receivers.length, "recipients", receivers);
      return true;
    } catch (error) {
      console.log(`❌ Failed to send email: ${error}`);
      return false;
    }
};

// sendEmail(
//   "Test Email",
//   "This is a test email to verify the email functionality.",
//   "henrydionizi@gmail.com",
//   "Newsfy",
// );

export default sendEmail;