import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useResume } from "../../context/ResumeContext";

const emptyEntry = { institution: "", degree: "", field: "", startYear: "", endYear: "", grade: "" };

export default function EducationForm() {
  const { resumeData, updateSection } = useResume();
  const list = resumeData.education;

  const add = () => updateSection("education", [...list, { ...emptyEntry }]);
  const remove = (i) => updateSection("education", list.filter((_, idx) => idx !== i));
  const change = (i, field, value) =>
    updateSection("education", list.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-800">Education</h2>
        </div>
        <button onClick={add} className="btn-primary flex items-center gap-1 text-sm py-1.5">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {list.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No education added yet.</p>
      )}

      {list.map((edu, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Education {i + 1}
            </span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Institution *", field: "institution", placeholder: "MIT / IIT Delhi" },
              { label: "Degree *", field: "degree", placeholder: "B.Tech / MBA" },
              { label: "Field of Study", field: "field", placeholder: "Computer Science" },
              { label: "Grade / CGPA", field: "grade", placeholder: "8.5 / 10" },
              { label: "Start Year", field: "startYear", placeholder: "2019" },
              { label: "End Year", field: "endYear", placeholder: "2023" },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  className="input-field"
                  value={edu[field]}
                  onChange={(e) => change(i, field, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
