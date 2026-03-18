const AdminSettings = require("../models/AdminSettings");

/**
 * Middleware to enforce time-based access control.
 * Form access is only allowed for N minutes after deployment.
 */
const timeControlMiddleware = async (req, res, next) => {
  try {
    let settings = await AdminSettings.findOne();

    if (!settings) {
      // First run — initialize settings
      settings = await AdminSettings.create({
        deploymentTime: new Date(),
        formAccessDurationMinutes: 20,
      });
    }

    const now = new Date();
    const deploymentTime = new Date(settings.deploymentTime);
    const allowedDurationMs = settings.formAccessDurationMinutes * 60 * 1000;
    const elapsed = now - deploymentTime;

    if (elapsed > allowedDurationMs) {
      return res.status(403).json({
        success: false,
        message: "Resume submission time has expired.",
        expired: true,
        deploymentTime: settings.deploymentTime,
        allowedMinutes: settings.formAccessDurationMinutes,
      });
    }

    // Attach remaining time to request
    req.remainingMs = allowedDurationMs - elapsed;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = timeControlMiddleware;
