const Resume = require("../models/Resume");

const generateResumeId = async () => {
  const year = new Date().getFullYear();
  const count = await Resume.countDocuments();
  return `RES-${year}-${String(1000 + count + 1).padStart(4, "0")}`;
};

module.exports = generateResumeId;
