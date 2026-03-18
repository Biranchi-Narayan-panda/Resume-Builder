import { useState } from "react";
import { Code, Plus, X, AlertCircle } from "lucide-react";
import { useResume } from "../../context/ResumeContext";
import { detectDuplicateSkills, suggestCapitalization } from "../../utils/analytics";

export default function SkillsForm() {
  const { resumeData, updateSection } = useResume();
  const skills = resumeData.skills;
  const [input, setInput] = useState("");

  const duplicates = detectDuplicateSkills(skills);

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    updateSection("skills", [...skills, trimmed]);
    setInput("");
  };

  const removeSkill = (i) => updateSection("skills", skills.filter((_, idx) => idx !== i));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestion = input.trim() ? suggestCapitalization(input) : "";

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Code className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold text-gray-800">Skills</h2>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          className="input-field flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. react, node.js (Enter to add)"
        />
        <button onClick={addSkill} className="btn-primary flex items-center gap-1 px-3">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {suggestion && suggestion !== input && (
        <button
          type="button"
          onClick={() => setInput(suggestion)}
          className="mb-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
        >
          💡 Suggestion: <span className="italic">{suggestion}</span>
        </button>
      )}

      {duplicates.map((skill) => (
        <div key={skill} className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded p-2 mb-2 text-xs text-orange-700">
          <AlertCircle className="w-3.5 h-3.5" />
          Duplicate skill detected: <strong>{skill}</strong>
        </div>
      ))}

      <div className="flex flex-wrap gap-2 mt-2">
        {skills.map((skill, i) => {
          const isDup = duplicates.includes(skill);
          return (
            <span
              key={i}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                isDup
                  ? "bg-orange-100 text-orange-700 border border-orange-300"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {skill}
              <button onClick={() => removeSkill(i)} className="hover:text-red-600 ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}
        {skills.length === 0 && (
          <p className="text-sm text-gray-400">No skills added yet.</p>
        )}
      </div>
    </div>
  );
}
