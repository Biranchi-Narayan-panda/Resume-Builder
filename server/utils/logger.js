const ActivityLog = require("../models/ActivityLog");

const logActivity = async (resumeId, action, details = {}, req = null) => {
  try {
    await ActivityLog.create({
      resumeId,
      action,
      details,
      ipAddress: req?.ip || "unknown",
      userAgent: req?.headers?.["user-agent"] || "unknown",
    });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
};

module.exports = logActivity;
