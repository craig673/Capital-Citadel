import nodemailer from "nodemailer";

const smtpPort = parseInt(process.env.SMTP_PORT || "587");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function test() {
  console.log("Testing email configuration...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER ? "set" : "not set");
  console.log("SMTP_PASS:", process.env.SMTP_PASS ? "set" : "not set");
  
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: "craig@10000daysfund.com",
      subject: "10,000 Days Capital - Email System Test",
      html: `
        <h2 style="color: #001F3F;">Email System Test Successful</h2>
        <p>This is a test email from the 10,000 Days Capital portal.</p>
        <p>If you received this email, your email notification system is configured correctly.</p>
        <p style="margin-top: 20px; color: #666;">
          Sent at: ${new Date().toLocaleString()}
        </p>
      `,
    });
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

test();
