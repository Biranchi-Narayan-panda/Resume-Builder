const mongoose = require("mongoose");

const ActivityLogSchema = new mongoose.Schema(
  {
    resumeId: { type: String, required: true },
    action: {
      type: String,
      enum: [
        "RESUME_CREATED",
        "RESUME_UPDATED",
        "PDF_GENERATED",
        "DOWNLOADED",
        "SHARED_EMAIL",
        "SHARED_WHATSAPP",
        "RESUME_DELETED",
      ],
      required: true,
    },
    details: { type: mongoose.Schema.Types.Mixed },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
