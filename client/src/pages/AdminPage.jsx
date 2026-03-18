import { useState, useEffect } from "react";
import { Users, Activity, Share2, Settings, Trash2, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { adminAPI } from "../services/api";

const TABS = ["Resumes", "Activity Logs", "Share History", "Settings"];

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <button onClick={() => onChange(!value)} className="focus:outline-none">
        {value ? (
          <ToggleRight className="w-8 h-8 text-blue-600" />
        ) : (
          <ToggleLeft className="w-8 h-8 text-gray-400" />
        )}
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("Resumes");
  const [resumes, setResumes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [shareHistory, setShareHistory] = useState([]);
  const [settings, setSettings] = useState(null);
  const [features, setFeatures] = useState({
    downloadEnabled: true,
    printEnabled: true,
    emailEnabled: true,
    whatsappEnabled: true,
    passwordProtection: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r, l, sh, s] = await Promise.all([
        adminAPI.getResumes(),
        adminAPI.getLogs(),
        adminAPI.getShareHistory(),
        adminAPI.getSettings(),
      ]);
      setResumes(r.data.data);
      setLogs(l.data.data);
      setShareHistory(sh.data.data);
      setSettings(s.data.data);
      setFeatures(s.data.data.globalFeatures);
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete resume ${id}?`)) return;
    try {
      await adminAPI.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.resumeId !== id));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleFeatureToggle = async (key, val) => {
    const updated = { ...features, [key]: val };
    setFeatures(updated);
    try {
      await adminAPI.updateFeatures(updated);
      toast.success("Feature updated");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleResetTimer = async () => {
    try {
      await adminAPI.resetTimer();
      toast.success("Timer reset! 20 minutes restarted.");
    } catch {
      toast.error("Reset failed");
    }
  };

  const TabIcon = { Resumes: Users, "Activity Logs": Activity, "Share History": Share2, Settings };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <button onClick={fetchAll} className="btn-secondary flex items-center gap-1 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Resumes", value: resumes.length, color: "blue" },
          { label: "Activity Logs", value: logs.length, color: "purple" },
          { label: "Shares", value: shareHistory.length, color: "green" },
          { label: "Total Downloads", value: resumes.reduce((a, r) => a + (r.downloadCount || 0), 0), color: "orange" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`card bg-${color}-50 border-${color}-100 text-center`}>
            <p className={`text-2xl font-bold text-${color}-700`}>{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-gray-400 py-8 animate-pulse">Loading...</div>}

      {/* Resumes Table */}
      {tab === "Resumes" && !loading && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Resume ID", "Name", "Email", "Phone", "Downloads", "Created", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resumes.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-gray-400 py-8">No resumes found</td></tr>
                )}
                {resumes.map((r) => (
                  <tr key={r.resumeId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-blue-700 font-medium">{r.resumeId}</td>
                    <td className="px-4 py-3">{r.personalInfo?.fullName}</td>
                    <td className="px-4 py-3 text-gray-600">{r.personalInfo?.email}</td>
                    <td className="px-4 py-3 text-gray-600">{r.personalInfo?.phone}</td>
                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                        {r.downloadCount || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(r.resumeId)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Logs */}
      {tab === "Activity Logs" && !loading && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Time", "Resume ID", "Action", "Details"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-gray-400 py-8">No logs</td></tr>
                )}
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 font-mono text-blue-700 text-xs">{log.resumeId}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        log.action.includes("CREATED") ? "bg-green-100 text-green-800" :
                        log.action.includes("DELETED") ? "bg-red-100 text-red-800" :
                        log.action.includes("SHARED") ? "bg-purple-100 text-purple-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Share History */}
      {tab === "Share History" && !loading && (
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {["Time", "Resume ID", "Method", "Recipient", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shareHistory.length === 0 && (
                  <tr><td colSpan={5} className="text-center text-gray-400 py-8">No share history</td></tr>
                )}
                {shareHistory.map((sh) => (
                  <tr key={sh._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-500">{new Date(sh.createdAt).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 font-mono text-blue-700 text-xs">{sh.resumeId}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        sh.method === "EMAIL" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}>
                        {sh.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{sh.recipient}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        sh.status === "SENT" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {sh.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === "Settings" && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              Feature Toggles
            </h3>
            <div className="divide-y divide-gray-100">
              {[
                { key: "downloadEnabled", label: "Enable Download" },
                { key: "printEnabled", label: "Enable Print" },
                { key: "emailEnabled", label: "Enable Email Sharing" },
                { key: "whatsappEnabled", label: "Enable WhatsApp Sharing" },
                { key: "passwordProtection", label: "Password Protection" },
              ].map(({ key, label }) => (
                <Toggle
                  key={key}
                  label={label}
                  value={features[key]}
                  onChange={(val) => handleFeatureToggle(key, val)}
                />
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Time Control</h3>
            {settings && (
              <div className="space-y-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Deployment Time</p>
                  <p className="font-medium">{new Date(settings.deploymentTime).toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Access Duration</p>
                  <p className="font-medium">{settings.formAccessDurationMinutes} minutes</p>
                </div>
              </div>
            )}
            <button onClick={handleResetTimer} className="btn-danger w-full flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset 20-Min Timer
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">
              This restarts the form access window from now.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
