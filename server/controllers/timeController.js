const AdminSettings = require("../models/AdminSettings");

// GET /api/time-status — Check if form access is allowed
const getTimeStatus = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({ deploymentTime: new Date() });
    }
    const now = new Date();
    const deploymentTime = new Date(settings.deploymentTime);
    const allowedMs = settings.formAccessDurationMinutes * 60 * 1000;
    const elapsed = now - deploymentTime;
    const remaining = allowedMs - elapsed;
    const isExpired = elapsed > allowedMs;

    res.json({
      success: true,
      isExpired,
      remainingMs: isExpired ? 0 : remaining,
      remainingMinutes: isExpired ? 0 : Math.ceil(remaining / 60000),
      deploymentTime: settings.deploymentTime,
      allowedMinutes: settings.formAccessDurationMinutes,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTimeStatus };
