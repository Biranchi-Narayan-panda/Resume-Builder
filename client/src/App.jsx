import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ResumeProvider } from "./context/ResumeContext";
import BuilderPage from "./pages/BuilderPage";
import AdminPage from "./pages/AdminPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import Navbar from "./components/shared/Navbar";

const PrivateAdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ResumeProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <BuilderPage />
              </>
            }
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <PrivateAdminRoute>
                <Navbar isAdmin />
                <AdminPage />
              </PrivateAdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ResumeProvider>
    </BrowserRouter>
  );
}
