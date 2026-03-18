const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  startDate: String,
  endDate: String,
  description: String,
});

const EducationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  startYear: String,
  endYear: String,
  grade: String,
});

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: String,
  link: String,
});

const CertificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  date: String,
  credentialId: String,
});

const ResumeSchema = new mongoose.Schema(
  {
    resumeId: {
      type: String,
      unique: true,
    },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: String,
      linkedIn: String,
      github: String,
      website: String,
      dateOfBirth: String,
      objective: String,
    },
    experience: [ExperienceSchema],
    education: [EducationSchema],
    skills: [String],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    languages: [String],
    hobbies: [String],

    // PDF & Download tracking
    downloadCount: { type: Number, default: 0 },
    pdfPassword: String,
    pdfUrl: String,
    downloadLinkExpiry: Date,

    // Feature flags (admin-controlled per resume)
    features: {
      downloadEnabled: { type: Boolean, default: true },
      printEnabled: { type: Boolean, default: true },
      emailEnabled: { type: Boolean, default: true },
      whatsappEnabled: { type: Boolean, default: true },
      passwordProtection: { type: Boolean, default: true },
    },

    lastEdited: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate Resume ID before saving
ResumeSchema.pre("save", async function (next) {
  if (!this.resumeId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("Resume").countDocuments();
    this.resumeId = `RES-${year}-${String(1000 + count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Resume", ResumeSchema);
