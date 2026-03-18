const express = require("express");
const router = express.Router();
const {
  createResume,
  getAllResumes,
  getResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");
const timeControl = require("../middleware/timeControl");
const { resumeValidationRules, validate } = require("../middleware/validation");

router.get("/", getAllResumes);
router.get("/:id", getResume);
router.post("/", timeControl, resumeValidationRules, validate, createResume);
router.put("/:id", timeControl, resumeValidationRules, validate, updateResume);
router.delete("/:id", deleteResume);

module.exports = router;
