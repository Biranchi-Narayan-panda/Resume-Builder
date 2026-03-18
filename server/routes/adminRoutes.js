const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAllResumes,
  getActivityLogs,
  getShareHistory,
  updateFeatures,
  updateResumeFeatures,
  getSettings,
  resetDeploymentTimer,
  deleteResume,
} = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");

router.post("/login", adminLogin);
router.get("/resumes", adminAuth, getAllResumes);
router.delete("/resumes/:id", adminAuth, deleteResume);
router.get("/logs", adminAuth, getActivityLogs);
router.get("/share-history", adminAuth, getShareHistory);
router.put("/features", adminAuth, updateFeatures);
router.put("/resumes/:id/features", adminAuth, updateResumeFeatures);
router.get("/settings", adminAuth, getSettings);
router.put("/settings/reset-timer", adminAuth, resetDeploymentTimer);

module.exports = router;
