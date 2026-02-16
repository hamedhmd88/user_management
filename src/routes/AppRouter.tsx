import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/layout/Layout";
import LoginPage from "../pages/LoginPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import UsersListPage from "../pages/UsersListPage";
import CreateUserPage from "../pages/CreateUserPage";
import EditUserPage from "../pages/EditUserPage";
import Spinner from "../components/ui/Spinner";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/users"           element={<Protected><Layout><UsersListPage /></Layout></Protected>} />
        <Route path="/users/create"    element={<Protected><Layout><CreateUserPage /></Layout></Protected>} />
        <Route path="/users/:id/edit"  element={<Protected><Layout><EditUserPage /></Layout></Protected>} />
        <Route path="/"                element={<Navigate to="/users" replace />} />
        <Route path="*"                element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900" dir="rtl">
            <div className="text-center space-y-3">
              <div className="text-6xl">🔍</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">۴۰۴</h1>
              <p className="text-gray-500">صفحه یافت نشد</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}