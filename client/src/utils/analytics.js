/**
 * Flatten all resume text into a single string for analysis
 */
export const extractResumeText = (resumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = resumeData;
  const parts = [
    personalInfo.fullName,
    personalInfo.objective,
    personalInfo.address,
    ...experience.map((e) => `${e.role} ${e.company} ${e.description}`),
    ...education.map((e) => `${e.degree} ${e.field} ${e.institution}`),
    ...skills,
    ...projects.map((p) => `${p.name} ${p.description} ${p.technologies}`),
    ...certifications.map((c) => `${c.name} ${c.issuer}`),
  ];
  return parts.filter(Boolean).join(" ");
};

export const analyzeResume = (resumeData) => {
  const text = extractResumeText(resumeData);
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  const wordCount = words.length;
  const charCount = text.length;
  const letterCount = text.replace(/\s/g, "").length;
  const paragraphs = [
    resumeData.personalInfo.objective,
    ...resumeData.experience.map((e) => e.description),
    ...resumeData.projects.map((p) => p.description),
  ].filter(Boolean).length;

  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return { wordCount, charCount, letterCount, paragraphs, readingTimeMin };
};

export const detectDuplicateSkills = (skills) => {
  const seen = new Map();
  const duplicates = [];
  skills.forEach((skill) => {
    const key = skill.toLowerCase().trim();
    if (seen.has(key)) duplicates.push(skill);
    else seen.set(key, true);
  });
  return duplicates;
};

export const suggestCapitalization = (text) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatLastEdited = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
