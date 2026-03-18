const mongoose = require("mongoose");

const AdminSettingsSchema = new mongoose.Schema(
  {
    globalFeatures: {
      downloadEnabled: { type: Boolean, default: true },
      printEnabled: { type: Boolean, default: true },
      emailEnabled: { type: Boolean, default: true },
      whatsappEnabled: { type: Boolean, default: true },
      passwordProtection: { type: Boolean, default: true },
    },
    deploymentTime: { type: Date, default: Date.now },
    formAccessDurationMinutes: { type: Number, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminSettings", AdminSettingsSchema);
