import { useState } from "react";
import {
  Save,
  Download,
  Mail,
  MessageCircle,
  Key,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { resumeAPI, pdfAPI } from "../../services/api";
import { useResume } from "../../context/ResumeContext";

export default function ActionButtons({ features = {}, isExpired }) {
  const { resumeData, savedResumeId, setSavedResumeId, setPdfPassword } =
    useResume();
  const [loading, setLoading] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState(null);

  const handleSave = async () => {
    if (
      !resumeData.personalInfo.fullName ||
      !resumeData.personalInfo.email ||
      !resumeData.personalInfo.phone
    ) {
      toast.error("Please fill in Name, Email, and Phone");
      return;
    }
    setLoading("save");
    try {
      let res;
      if (savedResumeId) {
        res = await resumeAPI.update(savedResumeId, resumeData);
        toast.success("Resume updated!");
      } else {
        res = await resumeAPI.create(resumeData);
        setSavedResumeId(res.data.data.resumeId);
        toast.success(`Resume saved! ID: ${res.data.data.resumeId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save resume");
    } finally {
      setLoading("");
    }
  };

  const handleGeneratePDF = async () => {
    if (!savedResumeId) {
      toast.error("Save your resume first");
      return;
    }
    setLoading("pdf");
    try {
      const res = await pdfAPI.generate(savedResumeId);
      const password = res.headers["x-pdf-password"];
      if (password) {
        setGeneratedPassword(password);
        setPdfPassword(password);
      }
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${savedResumeId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch (err) {
      toast.error(err.response?.data?.message || "PDF generation failed");
    } finally {
      setLoading("");
    }
  };

  const handleEmail = async () => {
    if (!emailInput) {
      toast.error("Enter recipient email");
      return;
    }
    if (!savedResumeId) {
      toast.error("Save resume first");
      return;
    }
    setLoading("email");
    try {
      await pdfAPI.email(savedResumeId, emailInput);
      toast.success("Resume sent via email!");
      setShowEmail(false);
      setEmailInput("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Email failed");
    } finally {
      setLoading("");
    }
  };

  const handleWhatsApp = async () => {
    if (!phoneInput) {
      toast.error("Enter phone number");
      return;
    }
    if (!savedResumeId) {
      toast.error("Save resume first");
      return;
    }
    setLoading("wa");
    try {
      const res = await pdfAPI.whatsapp(savedResumeId, phoneInput);
      window.open(res.data.whatsappUrl, "_blank");
      toast.success("WhatsApp link opened!");
      setShowWA(false);
      setPhoneInput("");
    } catch (err) {
      toast.error(err.response?.data?.message || "WhatsApp sharing failed");
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="card space-y-3">
      <h2 className="font-semibold text-gray-800 mb-1">Actions</h2>

      {savedResumeId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <div className="text-sm">
            <p className="font-medium text-green-800">Saved as</p>
            <p className="text-green-700 font-mono font-bold">
              {savedResumeId}
            </p>
          </div>
        </div>
      )}

      {generatedPassword && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <Key className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-800">PDF Password</p>
            <p className="font-mono font-bold text-blue-700 text-lg tracking-widest">
              {generatedPassword}
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Format: firstname-DDMMYYYY
            </p>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={loading === "save" || isExpired}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        {loading === "save"
          ? "Saving..."
          : savedResumeId
            ? "Update Resume"
            : "Save Resume"}
      </button>

      {features.downloadEnabled !== false && (
        <button
          onClick={handleGeneratePDF}
          disabled={loading === "pdf"}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          {loading === "pdf" ? "Generating..." : "Download PDF"}
        </button>
      )}

      {features.emailEnabled !== false && (
        <div>
          <button
            onClick={() => setShowEmail(!showEmail)}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Send via Email
          </button>
          {showEmail && (
            <div className="mt-2 flex gap-2">
              <input
                type="email"
                className="input-field flex-1"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="recipient@email.com"
              />
              <button
                onClick={handleEmail}
                disabled={loading === "email"}
                className="btn-primary px-3 text-sm"
              >
                {loading === "email" ? "..." : "Send"}
              </button>
            </div>
          )}
        </div>
      )}

      {features.whatsappEnabled !== false && (
        <div>
          <button
            onClick={() => setShowWA(!showWA)}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Share via WhatsApp
          </button>
          {showWA && (
            <div className="mt-2 flex gap-2">
              <input
                type="tel"
                className="input-field flex-1"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+91 9876543210"
              />
              <button
                onClick={handleWhatsApp}
                disabled={loading === "wa"}
                className="btn-primary px-3 text-sm"
              >
                {loading === "wa" ? "..." : "Share"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
