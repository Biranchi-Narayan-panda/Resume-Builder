import { BarChart2, AlertCircle, CheckCircle } from "lucide-react";
import { analyzeResume, detectDuplicateSkills } from "../../utils/analytics";

export default function AnalyticsPanel({ resumeData }) {
  const { wordCount, charCount, letterCount, paragraphs, readingTimeMin } =
    analyzeResume(resumeData);
  const duplicates = detectDuplicateSkills(resumeData.skills || []);
  const isUnderMin = wordCount > 0 && wordCount < 300;
  const isOverMax = wordCount > 700;

  const WordBar = () => {
    const pct = Math.min((wordCount / 700) * 100, 100);
    const color = isOverMax ? "bg-red-500" : wordCount >= 300 ? "bg-green-500" : "bg-amber-400";
    return (
      <div className="mt-2 mb-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0</span>
          <span>300 (min)</span>
          <span>700 (max)</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold text-gray-800">Resume Content Analysis</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Words", value: wordCount },
          { label: "Characters", value: charCount },
          { label: "Letters (incl. spaces)", value: letterCount },
          { label: "Paragraphs", value: paragraphs },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-700">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-lg p-3 mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-600">Estimated Reading Time</span>
        <span className="font-semibold text-blue-700">{readingTimeMin} min</span>
      </div>

      <WordBar />

      {/* Warnings */}
      <div className="space-y-2 mt-3">
        {isOverMax && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-700">Warning</p>
              <p className="text-xs text-red-600">
                The recommended resume length is under 700 words.
              </p>
            </div>
          </div>
        )}
        {isUnderMin && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">Recommended length: 300–700 words</p>
          </div>
        )}
        {duplicates.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3"
          >
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <p className="text-xs text-orange-700">
              Duplicate skill detected: <strong>{skill}</strong>
            </p>
          </div>
        ))}
        {!isOverMax && !isUnderMin && wordCount > 0 && duplicates.length === 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-xs text-green-700">Resume looks great!</p>
          </div>
        )}
      </div>
    </div>
  );
}
