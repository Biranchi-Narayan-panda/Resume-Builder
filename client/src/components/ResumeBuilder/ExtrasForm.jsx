import { useState } from "react";
import { Award, Plus, Trash2, Globe, Heart } from "lucide-react";
import { useResume } from "../../context/ResumeContext";

const emptyCert = { name: "", issuer: "", date: "", credentialId: "" };

export default function ExtrasForm() {
  const { resumeData, updateSection } = useResume();
  const { certifications, languages, hobbies } = resumeData;

  // Certifications
  const addCert = () => updateSection("certifications", [...certifications, { ...emptyCert }]);
  const removeCert = (i) => updateSection("certifications", certifications.filter((_, idx) => idx !== i));
  const changeCert = (i, field, value) =>
    updateSection("certifications", certifications.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  // Languages
  const [langInput, setLangInput] = useState("");
  const addLang = () => {
    if (!langInput.trim()) return;
    updateSection("languages", [...languages, langInput.trim()]);
    setLangInput("");
  };
  const removeLang = (i) => updateSection("languages", languages.filter((_, idx) => idx !== i));

  // Hobbies
  const [hobbyInput, setHobbyInput] = useState("");
  const addHobby = () => {
    if (!hobbyInput.trim()) return;
    updateSection("hobbies", [...hobbies, hobbyInput.trim()]);
    setHobbyInput("");
  };
  const removeHobby = (i) => updateSection("hobbies", hobbies.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {/* Certifications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-800">Certifications</h2>
          </div>
          <button onClick={addCert} className="btn-primary flex items-center gap-1 text-sm py-1.5">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {certifications.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">No certifications added.</p>
        )}
        {certifications.map((cert, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3 mb-3 bg-gray-50">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-blue-600">Certification {i + 1}</span>
              <button onClick={() => removeCert(i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Certificate Name", field: "name", placeholder: "AWS Cloud Practitioner" },
                { label: "Issuer", field: "issuer", placeholder: "Amazon Web Services" },
                { label: "Date", field: "date", placeholder: "March 2024" },
                { label: "Credential ID", field: "credentialId", placeholder: "ABC-12345" },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input className="input-field text-xs" value={cert[field]} onChange={(e) => changeCert(i, field, e.target.value)} placeholder={placeholder} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Languages */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-800">Languages</h2>
        </div>
        <div className="flex gap-2 mb-3">
          <input className="input-field" value={langInput} onChange={(e) => setLangInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addLang()} placeholder="e.g. English, Hindi" />
          <button onClick={addLang} className="btn-primary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang, i) => (
            <span key={i} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {lang}
              <button onClick={() => removeLang(i)}><Plus className="w-3 h-3 rotate-45" /></button>
            </span>
          ))}
        </div>
      </div>

      {/* Hobbies */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-800">Hobbies & Interests</h2>
        </div>
        <div className="flex gap-2 mb-3">
          <input className="input-field" value={hobbyInput} onChange={(e) => setHobbyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addHobby()} placeholder="e.g. Reading, Gaming" />
          <button onClick={addHobby} className="btn-primary px-3"><Plus className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hobbies.map((hobby, i) => (
            <span key={i} className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {hobby}
              <button onClick={() => removeHobby(i)}><Plus className="w-3 h-3 rotate-45" /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


