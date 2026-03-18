const mongoose = require("mongoose");

const ShareHistorySchema = new mongoose.Schema(
  {
    resumeId: { type: String, required: true },
    method: { type: String, enum: ["EMAIL", "WHATSAPP"], required: true },
    recipient: { type: String, required: true },
    status: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
    whatsappResendDisabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShareHistory", ShareHistorySchema);
