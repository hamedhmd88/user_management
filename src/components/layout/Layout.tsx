import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "../ui/Button";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Debug logging
  console.log("Current theme:", theme);

  return (
    <div
      className="min-h-screen bg-custom-bg text-custom-text transition-colors "
      dir="rtl"
    >
      <header className="sticky top-0 z-30 bg-custom-card/95 backdrop-blur-sm border-b border-custom-border shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/users"
            className="flex items-center gap-2 font-bold text-lg text-custom-accent"
          >
            <span className="text-2xl">🛡️</span>
            <span>مدیریت کاربران</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
            <Link
              to="/users"
              className="text-sm text-custom-muted hover:text-custom-accent transition-colors"
            >
              کاربران
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={
                theme === "dark" ? "تغییر به حالت روشن" : "تغییر به حالت تاریک"
              }
              className="p-2 rounded-lg hover:bg-custom-hover transition-colors text-xl cursor-pointer"
            >
              {theme === "dark" ? (
                <span role="img" aria-label="sun">
                  ☀️
                </span>
              ) : (
                <span role="img" aria-label="moon">
                  🌙
                </span>
              )}
            </button>
            <Button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center border-1 gap-1.5 px-3 py-1.5 text-sm rounded-lg text-custom-text hover:bg-custom-hover transition-colors"
            >
              خروج
              <span> ← </span>
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
