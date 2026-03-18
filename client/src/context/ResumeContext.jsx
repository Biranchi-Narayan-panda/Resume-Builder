import { createContext, useContext, useState, useCallback } from "react";

const defaultResume = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedIn: "",
    github: "",
    website: "",
    dateOfBirth: "",
    objective: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  hobbies: [],
};

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(defaultResume);
  const [savedResumeId, setSavedResumeId] = useState(null);
  const [lastEdited, setLastEdited] = useState(null);
  const [pdfPassword, setPdfPassword] = useState(null);

  const updatePersonalInfo = useCallback((field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
    setLastEdited(new Date());
  }, []);

  const updateSection = useCallback((section, value) => {
    setResumeData((prev) => ({ ...prev, [section]: value }));
    setLastEdited(new Date());
  }, []);

  const resetResume = () => {
    setResumeData(defaultResume);
    setSavedResumeId(null);
    setLastEdited(null);
    setPdfPassword(null);
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updatePersonalInfo,
        updateSection,
        savedResumeId,
        setSavedResumeId,
        lastEdited,
        setLastEdited,
        pdfPassword,
        setPdfPassword,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside ResumeProvider");
  return ctx;
};
