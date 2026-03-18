import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 30000,
});

// Attach admin token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Resume APIs
export const resumeAPI = {
  create: (data) => API.post("/resumes", data),
  getAll: () => API.get("/resumes"),
  getById: (id) => API.get(`/resumes/${id}`),
  update: (id, data) => API.put(`/resumes/${id}`, data),
  delete: (id) => API.delete(`/resumes/${id}`),
};

// PDF APIs
export const pdfAPI = {
  generate: (id) => API.post(`/pdf/generate/${id}`, {}, { responseType: "blob" }),
  download: (id) => API.get(`/pdf/download/${id}`, { responseType: "blob" }),
  email: (id, recipientEmail) => API.post(`/pdf/email/${id}`, { recipientEmail }),
  whatsapp: (id, phoneNumber) => API.post(`/pdf/whatsapp/${id}`, { phoneNumber }),
};

// Admin APIs
export const adminAPI = {
  login: (data) => API.post("/admin/login", data),
  getResumes: () => API.get("/admin/resumes"),
  deleteResume: (id) => API.delete(`/admin/resumes/${id}`),
  getLogs: () => API.get("/admin/logs"),
  getShareHistory: () => API.get("/admin/share-history"),
  updateFeatures: (data) => API.put("/admin/features", data),
  updateResumeFeatures: (id, data) => API.put(`/admin/resumes/${id}/features`, data),
  getSettings: () => API.get("/admin/settings"),
  resetTimer: () => API.put("/admin/settings/reset-timer"),
};

// Time status API
export const timeAPI = {
  getStatus: () => API.get("/time-status"),
};

export default API;
