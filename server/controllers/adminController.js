const jwt = require("jsonwebtoken");
const Resume = require("../models/Resume");
const ActivityLog = require("../models/ActivityLog");
const ShareHistory = require("../models/ShareHistory");
const AdminSettings = require("../models/AdminSettings");

// POST /api/admin/login
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }
  const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ success: true, token });
};

// GET /api/admin/resumes
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json({ success: true, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/logs
const getActivityLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/share-history
const getShareHistory = async (req, res) => {
  try {
    const history = await ShareHistory.find().sort({ createdAt: -1 });
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/features — Update global feature toggles
const updateFeatures = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = new AdminSettings();
    settings.globalFeatures = { ...settings.globalFeatures, ...req.body };
    await settings.save();
    res.json({ success: true, data: settings.globalFeatures });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/resumes/:id/features — Per-resume feature toggles
const updateResumeFeatures = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { resumeId: req.params.id },
      { features: req.body },
      { new: true }
    );
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    res.json({ success: true, data: resume.features });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/settings
const getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/settings/reset-timer — Reset deployment timer
const resetDeploymentTimer = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = new AdminSettings();
    settings.deploymentTime = new Date();
    await settings.save();
    res.json({ success: true, message: "Timer reset", deploymentTime: settings.deploymentTime });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/resumes/:id
const deleteResume = async (req, res) => {
  try {
    await Resume.findOneAndDelete({ resumeId: req.params.id });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  adminLogin,
  getAllResumes,
  getActivityLogs,
  getShareHistory,
  updateFeatures,
  updateResumeFeatures,
  getSettings,
  resetDeploymentTimer,
  deleteResume,
};
