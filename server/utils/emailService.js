const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send resume via email with PDF attachment and password
 * @param {string} recipientEmail
 * @param {string} recipientName
 * @param {Buffer} pdfBuffer
 * @param {string} password
 * @param {string} resumeId
 */
const sendResumeEmail = async (recipientEmail, recipientName, pdfBuffer, password, resumeId) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Your Resume - ${resumeId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Your Resume is Ready! 🎉</h2>
        <p>Dear ${recipientName},</p>
        <p>Please find your resume attached as a PDF document.</p>
        
        <div style="background: #f0f4ff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <h3 style="margin: 0 0 8px; color: #1e40af;">🔐 PDF Password</h3>
          <p style="margin: 0; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #1e293b;">${password}</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">Use this password to open your PDF resume.</p>
        </div>

        <p><strong>Resume ID:</strong> ${resumeId}</p>
        <p style="color: #64748b; font-size: 13px;">This resume was generated on ${new Date().toLocaleString("en-IN")}.</p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Sent via Resume Builder Application</p>
      </div>
    `,
    attachments: [
      {
        filename: `${resumeId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { sendResumeEmail };
