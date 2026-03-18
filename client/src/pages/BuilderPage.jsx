import { useState } from "react";
import useTimeControl from "../hooks/useTimeControl";
import TimeBanner from "../components/shared/TimeBanner";
import PersonalInfoForm from "../components/ResumeBuilder/PersonalInfoForm";
import ExperienceForm from "../components/ResumeBuilder/ExperienceForm";
import EducationForm from "../components/ResumeBuilder/EducationForm";
import SkillsForm from "../components/ResumeBuilder/SkillsForm";
import ProjectsForm from "../components/ResumeBuilder/ProjectsForm";
import ExtrasForm from "../components/ResumeBuilder/ExtrasForm";
import ResumePreview from "../components/ResumePreview/ResumePreview";
import AnalyticsPanel from "../components/Analytics/AnalyticsPanel";
import ActionButtons from "../components/ResumeBuilder/ActionButtons";
import { useResume } from "../context/ResumeContext";

const TABS = ["Personal", "Experience", "Education", "Skills", "Projects", "Extras"];

export default function BuilderPage() {
  const { isExpired, formatRemaining, loading } = useTimeControl();
  const { resumeData } = useResume();
  const [activeTab, setActiveTab] = useState("Personal");
  const [view, setView] = useState("form"); // 'form' | 'preview'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <TimeBanner isExpired={isExpired} formatRemaining={formatRemaining} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile toggle */}
        <div className="flex gap-2 mb-4 lg:hidden">
          <button
            onClick={() => setView("form")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${view === "form" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"}`}
          >
            Form
          </button>
          <button
            onClick={() => setView("preview")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium ${view === "preview" ? "bg-blue-600 text-white" : "bg-white text-gray-600 border"}`}
          >
            Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: Form */}
          <div className={`space-y-4 ${view === "preview" ? "hidden lg:block" : ""}`}>
            {/* Tab navigation */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Disabled overlay if expired */}
            <div className={`space-y-4 ${isExpired ? "opacity-50 pointer-events-none" : ""}`}>
              {activeTab === "Personal" && <PersonalInfoForm />}
              {activeTab === "Experience" && <ExperienceForm />}
              {activeTab === "Education" && <EducationForm />}
              {activeTab === "Skills" && <SkillsForm />}
              {activeTab === "Projects" && <ProjectsForm />}
              {activeTab === "Extras" && <ExtrasForm />}
            </div>

            <AnalyticsPanel resumeData={resumeData} />
            <ActionButtons isExpired={isExpired} />
          </div>

          {/* RIGHT: Preview */}
          <div className={`${view === "form" ? "hidden lg:block" : ""}`}>
            <div className="sticky top-20 space-y-4">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
