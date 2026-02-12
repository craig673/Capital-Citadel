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

export async function sendDocumentUploadEmail(user: {
  firstName: string | null;
  lastName: string | null;
}, fileName: string) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown Investor";
  
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Document Uploaded by ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #001F3F;">New Document Upload</h2>
          <p>A new document has been uploaded to the 10,000 Days Capital portal.</p>
          <table style="border-collapse: collapse; margin-top: 20px; width: 100%;">
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Investor</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${fullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">File Name</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${fileName}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            <a href="${process.env.APP_URL || 'https://10000dayscapital.com'}/admin/approvals" 
               style="background-color: #001F3F; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 1px;">
              View Uploads
            </a>
          </p>
        </div>
      `,
    });
    console.log(`[email] Document upload notification sent for ${fileName}`);
  } catch (error) {
    console.error("[email] Failed to send document upload notification:", error);
  }
}

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

export async function sendWelcomeEmail(user: {
  firstName: string | null;
  email: string;
}) {
  const firstName = user.firstName || "Investor";
  const loginUrl = `${process.env.APP_URL || 'https://10000dayscapital.com'}/auth/login`;
  
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: user.email,
      subject: "Welcome to 10,000 Days Capital – Access Granted",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Dear ${firstName},</p>
          
          <p>We are pleased to inform you that your account has been approved and is now ready for use.</p>
          
          <p>You can now access the 10,000 Days Capital investor portal using the email and password you created during registration.</p>
          
          <p style="margin: 30px 0; text-align: center;">
            <a href="${loginUrl}" 
               style="background-color: #001F3F; color: white; padding: 14px 28px; text-decoration: none; display: inline-block; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
              Client Login
            </a>
          </p>
          
          <p>If you have any questions or need assistance, please don't hesitate to reach out to your designated contact at 10,000 Days Capital.</p>
          
          <p>Sincerely,<br>The 10,000 Days Capital Team</p>
        </div>
      `,
    });
    console.log(`[email] Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error("[email] Failed to send welcome email:", error);
  }
}

export async function sendApplicationEmail(
  applicant: { name: string; email: string },
  attachments: Array<{ filename: string; content: Buffer }>
) {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: "craig@10000days.com",
      subject: "A wild applicant has appeared!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #001F3F;">New Job Application</h2>
          <p>A new application has been submitted through the 10,000 Days Capital careers page.</p>
          <table style="border-collapse: collapse; margin-top: 20px; width: 100%;">
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Name</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${applicant.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Email</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${applicant.email}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; background: #f5f5f5;">Attachments</td>
              <td style="padding: 12px; border: 1px solid #ddd;">${attachments.length} file(s)</td>
            </tr>
          </table>
          <p style="margin-top: 20px; color: #666;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      attachments: attachments.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    console.log(`[email] Application email sent for ${applicant.name} (${applicant.email})`);
  } catch (error) {
    console.error("[email] Failed to send application email:", error);
    throw error;
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
