const Resume = require("../models/Resume");
const logActivity = require("../utils/logger");

// POST /api/resumes — Create
const createResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    await logActivity(resume.resumeId, "RESUME_CREATED", {}, req);
    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/resumes — All resumes
const getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/resumes/:id — Single resume
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ resumeId: req.params.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/resumes/:id — Update
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { resumeId: req.params.id },
      { ...req.body, lastEdited: new Date() },
      { new: true, runValidators: true }
    );
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    await logActivity(resume.resumeId, "RESUME_UPDATED", {}, req);
    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/resumes/:id — Delete
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ resumeId: req.params.id });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });
    await logActivity(req.params.id, "RESUME_DELETED", {}, req);
    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createResume, getAllResumes, getResume, updateResume, deleteResume };
