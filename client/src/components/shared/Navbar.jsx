import { Link, useNavigate } from "react-router-dom";
import { FileText, Shield, LogOut } from "lucide-react";

export default function Navbar({ isAdmin }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
            <FileText className="w-5 h-5" />
            Resume Builder
          </Link>
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <Link
                to="/admin/login"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {isAdmin && token && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
