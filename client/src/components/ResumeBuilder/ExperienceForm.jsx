import { Briefcase, Plus, Trash2 } from "lucide-react";
import { useResume } from "../../context/ResumeContext";

const emptyEntry = {
  company: "", role: "", startDate: "", endDate: "", description: "",
};

export default function ExperienceForm() {
  const { resumeData, updateSection } = useResume();
  const list = resumeData.experience;

  const add = () => updateSection("experience", [...list, { ...emptyEntry }]);
  const remove = (i) => updateSection("experience", list.filter((_, idx) => idx !== i));
  const change = (i, field, value) => {
    const updated = list.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item
    );
    updateSection("experience", updated);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <h2 className="font-semibold text-gray-800">Work Experience</h2>
        </div>
        <button onClick={add} className="btn-primary flex items-center gap-1 text-sm py-1.5">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {list.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No experience added yet.</p>
      )}

      {list.map((exp, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Experience {i + 1}
            </span>
            <button onClick={() => remove(i)} className="text-red-500 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Job Title / Role *", field: "role", placeholder: "Frontend Developer" },
              { label: "Company *", field: "company", placeholder: "TechCorp Pvt. Ltd." },
              { label: "Start Date", field: "startDate", placeholder: "Jan 2022" },
              { label: "End Date", field: "endDate", placeholder: "Present" },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  className="input-field"
                  value={exp[field]}
                  onChange={(e) => change(i, field, e.target.value)}
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={exp.description}
              onChange={(e) => change(i, "description", e.target.value)}
              placeholder="Describe your responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
