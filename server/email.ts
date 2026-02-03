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

const ADMIN_EMAIL = "craig@10000daysfund.com";
const FROM_EMAIL = process.env.SMTP_FROM || "noreply@10000dayscapital.com";

export async function sendNewAccessRequestEmail(user: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown";
  
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: "New Access Request",
      html: `
        <h2>New Access Request</h2>
        <p>A new user has requested access to the 10,000 Days Capital portal.</p>
        <table style="border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${user.email}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">
          <a href="${process.env.APP_URL || 'https://10000dayscapital.com'}/admin/approvals" 
             style="background-color: #001F3F; color: white; padding: 10px 20px; text-decoration: none; display: inline-block;">
            Review Request
          </a>
        </p>
      `,
    });
    console.log(`[email] New access request notification sent for ${user.email}`);
  } catch (error) {
    console.error("[email] Failed to send new access request email:", error);
  }
}

export async function sendDenialEmail(user: {
  firstName: string | null;
  email: string;
}) {
  const firstName = user.firstName || "Investor";
  
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: user.email,
      subject: "Update on your Access Request",
      html: `
        <p>Dear ${firstName},</p>
        <p>Thank you for requesting access to the 10,000 Days Capital portal. We have received your request, but are unable to grant access at this time.</p>
        <p>To continue the verification process, please reach out to your designated contact at 10,000 Days Capital directly.</p>
        <p>Sincerely,<br>The 10,000 Days Capital Team</p>
      `,
    });
    console.log(`[email] Denial notification sent to ${user.email}`);
  } catch (error) {
    console.error("[email] Failed to send denial email:", error);
  }
}

export async function sendTestEmail(): Promise<{ success: boolean; message: string }> {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
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
    console.log(`[email] Test email sent successfully to ${ADMIN_EMAIL}`);
    return { success: true, message: `Test email sent to ${ADMIN_EMAIL}` };
  } catch (error: any) {
    console.error("[email] Failed to send test email:", error);
    return { success: false, message: error.message || "Failed to send test email" };
  }
}
