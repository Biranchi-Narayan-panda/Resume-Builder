import { useState } from "react";
import { User, Lightbulb } from "lucide-react";
import { useResume } from "../../context/ResumeContext";
import { suggestCapitalization } from "../../utils/analytics";

const Field = ({ label, name, type = "text", value, onChange, placeholder, suggestion }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="input-field"
    />
    {suggestion && suggestion !== value && (
      <button
        type="button"
        onClick={() => onChange(name, suggestion)}
        className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
      >
        <Lightbulb className="w-3 h-3" />
        Suggestion: <span className="italic">{suggestion}</span>
      </button>
    )}
  </div>
);

export default function PersonalInfoForm() {
  const { resumeData, updatePersonalInfo } = useResume();
  const { personalInfo } = resumeData;

  const getCapSuggestion = (field) => {
    const val = personalInfo[field];
    if (!val) return null;
    const suggested = suggestCapitalization(val);
    return suggested !== val ? suggested : null;
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold text-gray-800">Personal Information</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Full Name *"
          name="fullName"
          value={personalInfo.fullName}
          onChange={updatePersonalInfo}
          placeholder="Biranchi Narayan"
          suggestion={getCapSuggestion("fullName")}
        />
        <Field
          label="Email *"
          name="email"
          type="email"
          value={personalInfo.email}
          onChange={updatePersonalInfo}
          placeholder="biranchi@gmail.com"
        />
        <Field
          label="Phone *"
          name="phone"
          value={personalInfo.phone}
          onChange={updatePersonalInfo}
          placeholder="+91 0000000000"
        />
        <Field
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={personalInfo.dateOfBirth}
          onChange={updatePersonalInfo}
        />
        <Field
          label="Address"
          name="address"
          value={personalInfo.address}
          onChange={updatePersonalInfo}
          placeholder="City, State"
          suggestion={getCapSuggestion("address")}
        />
        <Field
          label="LinkedIn"
          name="linkedIn"
          value={personalInfo.linkedIn}
          onChange={updatePersonalInfo}
          placeholder="linkedin.com"
        />
        <Field
          label="GitHub"
          name="github"
          value={personalInfo.github}
          onChange={updatePersonalInfo}
          placeholder="github.com"
        />
        <Field
          label="Website / Portfolio"
          name="website"
          value={personalInfo.website}
          onChange={updatePersonalInfo}
          placeholder="https://Biranchi.com"
        />
      </div>
      <div className="mt-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">Professional Objective</label>
        <textarea
          value={personalInfo.objective}
          onChange={(e) => updatePersonalInfo("objective", e.target.value)}
          placeholder="A motivated software developer with Lots of experience..."
          rows={3}
          className="input-field resize-none"
        />
      </div>
    </div>
  );
}
