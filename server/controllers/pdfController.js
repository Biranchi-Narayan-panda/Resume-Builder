const Resume = require("../models/Resume");
const ShareHistory = require("../models/ShareHistory");
const { generatePDF, generatePDFPassword } = require("../utils/pdfService");
const { sendResumeEmail } = require("../utils/emailService");
const logActivity = require("../utils/logger");

// POST /api/pdf/generate/:id
const generateResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({ resumeId: req.params.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    const password = generatePDFPassword(
      resume.personalInfo.fullName,
      resume.personalInfo.dateOfBirth
    );

    const pdfBuffer = await generatePDF(resume);

    // Set expiry 24 hours from now
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    resume.pdfPassword = password;
    resume.downloadLinkExpiry = expiry;
    resume.downloadCount += 1;
    await resume.save();

    await logActivity(resume.resumeId, "PDF_GENERATED", { password }, req);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resume.resumeId}.pdf"`,
      "X-PDF-Password": password,
      "X-Resume-Id": resume.resumeId,
    });

    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/pdf/email/:id
const emailResume = async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    const resume = await Resume.findOne({ resumeId: req.params.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    if (!resume.features.emailEnabled) {
      return res.status(403).json({ success: false, message: "Email feature is disabled" });
    }

    const password = resume.pdfPassword || generatePDFPassword(
      resume.personalInfo.fullName,
      resume.personalInfo.dateOfBirth
    );
    const pdfBuffer = await generatePDF(resume);

    await sendResumeEmail(
      recipientEmail,
      resume.personalInfo.fullName,
      pdfBuffer,
      password,
      resume.resumeId
    );

    await ShareHistory.create({
      resumeId: resume.resumeId,
      method: "EMAIL",
      recipient: recipientEmail,
    });

    await logActivity(resume.resumeId, "SHARED_EMAIL", { recipient: recipientEmail }, req);

    res.json({ success: true, message: "Resume sent via email successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/pdf/whatsapp/:id
const whatsappResume = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const resume = await Resume.findOne({ resumeId: req.params.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    if (!resume.features.whatsappEnabled) {
      return res.status(403).json({ success: false, message: "WhatsApp feature is disabled" });
    }

    // Check if already sent to this number (disable resend)
    const existingShare = await ShareHistory.findOne({
      resumeId: resume.resumeId,
      method: "WHATSAPP",
      recipient: phoneNumber,
    });

    if (existingShare) {
      return res.status(400).json({
        success: false,
        message: "Resume already sent to this number. Resend is disabled.",
      });
    }

    const password = resume.pdfPassword || generatePDFPassword(
      resume.personalInfo.fullName,
      resume.personalInfo.dateOfBirth
    );

    // Generate WhatsApp URL (wa.me deep link)
    const message = encodeURIComponent(
      `Hi! Here is your resume (${resume.resumeId}).\nPDF Password: ${password}\nGenerated on: ${new Date().toLocaleString("en-IN")}`
    );
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${message}`;

    await ShareHistory.create({
      resumeId: resume.resumeId,
      method: "WHATSAPP",
      recipient: phoneNumber,
      whatsappResendDisabled: true,
    });

    await logActivity(resume.resumeId, "SHARED_WHATSAPP", { recipient: phoneNumber }, req);

    res.json({ success: true, whatsappUrl, message: "WhatsApp link generated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/pdf/download/:id — Download with expiry check
const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ resumeId: req.params.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    if (!resume.features.downloadEnabled) {
      return res.status(403).json({ success: false, message: "Download feature is disabled" });
    }

    if (resume.downloadLinkExpiry && new Date() > resume.downloadLinkExpiry) {
      return res.status(410).json({
        success: false,
        message: "This resume link has expired. Please generate again.",
        expired: true,
      });
    }

    const pdfBuffer = await generatePDF(resume);
    resume.downloadCount += 1;
    await resume.save();

    await logActivity(resume.resumeId, "DOWNLOADED", {}, req);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${resume.resumeId}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { generateResumePDF, emailResume, whatsappResume, downloadResume };
