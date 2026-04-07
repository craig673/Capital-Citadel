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
      to: "craig@10000daysfund.com",
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

export async function sendApplicationConfirmationEmail(
  applicant: { name: string; email: string }
) {
  try {
    await transporter.sendMail({
      from: `"10,000 Days Capital (No Reply)" <${process.env.SMTP_USER}>`,
      to: applicant.email,
      subject: "Application Received - 10,000 Days Capital",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #001F3F; color: #ffffff; border: 1px solid #C5A059;">
          <div style="padding: 32px 40px 24px; text-align: center; border-bottom: 2px solid #C5A059;">
            <h1 style="font-size: 22px; font-weight: 700; letter-spacing: 2px; margin: 0; color: #C5A059;">10,000 DAYS CAPITAL</h1>
            <p style="font-size: 11px; letter-spacing: 3px; color: #C5A059; margin: 6px 0 0; text-transform: uppercase;">Management, LP</p>
          </div>
          <div style="padding: 36px 40px;">
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 20px;">
              Thank you for your interest in joining the 10,000 Days Capital Team. Your application has been successfully received and is currently being reviewed by our partners.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 20px;">
              We appreciate the time and effort you put into your submission. Due to the high volume of applications, we prioritize candidates who demonstrate the conviction and curiosity required to navigate The AIRS Revolution&trade;.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0;">
              We will be in contact if your background aligns with our current needs.
            </p>
          </div>
          <div style="padding: 24px 40px; border-top: 1px solid rgba(197,160,89,0.3); text-align: center;">
            <p style="font-size: 13px; color: #999; margin: 0 0 8px;">
              If you have urgent questions or need to follow up, please email
              <a href="mailto:hr@10000dayscapital.com" style="color: #C5A059; text-decoration: none;">hr@10000dayscapital.com</a>.
            </p>
            <p style="font-size: 12px; color: #666; margin: 12px 0 0; letter-spacing: 1px;">
              &mdash; 10,000 Days Capital Management, LP<br/>
              New York &nbsp;|&nbsp; Las Cruces
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[email] Confirmation email sent to applicant ${applicant.email}`);
  } catch (error) {
    console.error("[email] Failed to send confirmation email to applicant:", error);
  }
}

export async function sendRsvpNotification(rsvp: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New RSVP: Santa Fe Event - ${rsvp.firstName} ${rsvp.lastName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #001F3F; color: #ffffff; border: 1px solid #C5A059;">
          <div style="padding: 32px 40px 24px; text-align: center; border-bottom: 2px solid #C5A059;">
            <h1 style="font-size: 22px; font-weight: 700; letter-spacing: 2px; margin: 0; color: #C5A059;">10,000 DAYS CAPITAL</h1>
            <p style="font-size: 11px; letter-spacing: 3px; color: #C5A059; margin: 6px 0 0; text-transform: uppercase;">Santa Fe Event RSVP</p>
          </div>
          <div style="padding: 36px 40px;">
            <h2 style="color: #C5A059; margin: 0 0 20px; font-size: 18px;">New RSVP Received</h2>
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); font-weight: bold; color: #C5A059; background: rgba(197,160,89,0.1);">First Name</td>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); color: #e0e0e0;">${rsvp.firstName}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); font-weight: bold; color: #C5A059; background: rgba(197,160,89,0.1);">Last Name</td>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); color: #e0e0e0;">${rsvp.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); font-weight: bold; color: #C5A059; background: rgba(197,160,89,0.1);">Email</td>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); color: #e0e0e0;">${rsvp.email}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); font-weight: bold; color: #C5A059; background: rgba(197,160,89,0.1);">RSVP Time</td>
                <td style="padding: 12px; border: 1px solid rgba(197,160,89,0.3); color: #e0e0e0;">${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; font-size: 14px; color: #999;">Event: September 9&ndash;11 &bull; La Fonda on the Plaza, Santa Fe</p>
          </div>
        </div>
      `,
    });
    console.log(`[email] RSVP notification sent for ${rsvp.firstName} ${rsvp.lastName}`);
  } catch (error) {
    console.error("[email] Failed to send RSVP notification:", error);
    throw error;
  }
}

export async function sendRejectionEmail(
  applicant: { name: string; email: string }
) {
  try {
    await transporter.sendMail({
      from: `"10,000 Days Capital (No Reply)" <${process.env.SMTP_USER}>`,
      to: applicant.email,
      subject: "Update regarding your application to 10,000 Days Capital",
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #001F3F; color: #ffffff; border: 1px solid #C5A059;">
          <div style="padding: 32px 40px 24px; text-align: center; border-bottom: 2px solid #C5A059;">
            <h1 style="font-size: 22px; font-weight: 700; letter-spacing: 2px; margin: 0; color: #C5A059;">10,000 DAYS CAPITAL</h1>
            <p style="font-size: 11px; letter-spacing: 3px; color: #C5A059; margin: 6px 0 0; text-transform: uppercase;">Management, LP</p>
          </div>
          <div style="padding: 36px 40px;">
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 20px;">
              Dear ${applicant.name},
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 20px;">
              Thank you for giving us the opportunity to review your background and interest in 10,000 Days Capital.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 20px;">
              We have reviewed your qualifications in detail. After careful consideration, we have decided to move forward with other candidates who more closely align with our current specific needs for this role.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 20px;">
              This industry attracts remarkable talent, and this decision was difficult given the high caliber of applications we received.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 20px;">
              Please note that due to our recruitment policy and the volume of applications, we are unable to provide specific feedback on individual applications or respond to follow-up inquiries regarding this decision.
            </p>
            <p style="font-size: 15px; line-height: 1.7; color: #e0e0e0; margin: 0 0 4px;">
              We wish you the best in your future endeavors.
            </p>
          </div>
          <div style="padding: 24px 40px; border-top: 1px solid rgba(197,160,89,0.3); text-align: center;">
            <p style="font-size: 13px; color: #999; margin: 0; font-style: italic;">Regards,</p>
            <p style="font-size: 12px; color: #666; margin: 12px 0 0; letter-spacing: 1px;">
              10,000 Days Capital Management, LP
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[email] Rejection email sent to ${applicant.email}`);
  } catch (error) {
    console.error("[email] Failed to send rejection email:", error);
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
