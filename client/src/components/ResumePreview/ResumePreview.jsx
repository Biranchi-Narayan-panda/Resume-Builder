import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer, Clock } from "lucide-react";
import { useResume } from "../../context/ResumeContext";
import { formatLastEdited } from "../../utils/analytics";

const Section = ({ title, children }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-2">
      <h2 className="text-xs font-bold uppercase tracking-widest text-blue-700">{title}</h2>
      <div className="flex-1 h-px bg-blue-100" />
    </div>
    {children}
  </div>
);

export default function ResumePreview() {
  const { resumeData, lastEdited } = useResume();
  const { personalInfo, experience, education, skills, projects, certifications, languages } = resumeData;
  const printRef = useRef();

  const handlePrint = useReactToPrint({ content: () => printRef.current });

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 no-print">
        <h2 className="font-semibold text-gray-700 text-sm">Live Preview</h2>
        <div className="flex items-center gap-3">
          {lastEdited && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last Edited: {formatLastEdited(lastEdited)}
            </span>
          )}
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-1 text-sm py-1.5">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        className="bg-white p-8 min-h-[1100px] font-sans text-gray-900"
        style={{ fontSize: "13px", lineHeight: "1.6" }}
      >
        {/* Header */}
        <div className="border-b-2 border-blue-600 pb-4 mb-5">
          <h1 className="text-2xl font-bold text-blue-800 mb-1">
            {personalInfo.fullName || "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
            {personalInfo.address && <span>📍 {personalInfo.address}</span>}
            {personalInfo.linkedIn && <span>💼 {personalInfo.linkedIn}</span>}
            {personalInfo.github && <span>🐙 {personalInfo.github}</span>}
            {personalInfo.website && <span>🌐 {personalInfo.website}</span>}
          </div>
          {personalInfo.objective && (
            <p className="mt-3 text-xs text-gray-600 leading-relaxed">{personalInfo.objective}</p>
          )}
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Work Experience">
            {experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{exp.role}</p>
                    <p className="text-xs text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : " – Present"}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1 text-xs text-gray-600">{exp.description}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                    {edu.grade && <p className="text-xs text-gray-500">Grade: {edu.grade}</p>}
                  </div>
                  <span className="text-xs text-gray-400">
                    {edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ""}
                  </span>
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((proj, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-900">{proj.name}</p>
                  {proj.link && <a href={proj.link} className="text-xs text-blue-600">{proj.link}</a>}
                </div>
                {proj.technologies && <p className="text-xs text-gray-500 italic">{proj.technologies}</p>}
                {proj.description && <p className="text-xs text-gray-600 mt-1">{proj.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section title="Certifications">
            {certifications.map((cert, i) => (
              <div key={i} className="mb-2 flex justify-between">
                <div>
                  <p className="font-semibold text-sm">{cert.name}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}{cert.credentialId ? ` · ${cert.credentialId}` : ""}</p>
                </div>
                <span className="text-xs text-gray-400">{cert.date}</span>
              </div>
            ))}
          </Section>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <Section title="Languages">
            <p className="text-sm text-gray-700">{languages.join(" • ")}</p>
          </Section>
        )}
      </div>
    </div>
  );
}
