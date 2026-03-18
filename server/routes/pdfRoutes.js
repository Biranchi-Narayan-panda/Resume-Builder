const express = require("express");
const router = express.Router();
const {
  generateResumePDF,
  emailResume,
  whatsappResume,
  downloadResume,
} = require("../controllers/pdfController");

router.post("/generate/:id", generateResumePDF);
router.get("/download/:id", downloadResume);
router.post("/email/:id", emailResume);
router.post("/whatsapp/:id", whatsappResume);

module.exports = router;
