import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" dir="rtl">
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/users" className="flex items-center gap-2 font-bold text-lg text-blue-600 dark:text-blue-400">
            <span className="text-2xl">🛡️</span>
            <span>مدیریت کاربران</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link to="/users" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              کاربران
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} title="تغییر تم"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl">
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <button onClick={() => { logout(); navigate("/login"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              خروج <span>→</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}