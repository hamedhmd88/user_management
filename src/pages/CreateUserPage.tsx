import React from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useToast } from "../contexts/ToastContext";
import UserForm from "../components/users/UserForm";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const toast = useToast();

  async function handleCreate(payload: any) {
    await userService.createUser(payload);
    toast.success("کاربر جدید با موفقیت ایجاد شد.");
    navigate("/users");
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>←</span>
          <span>بازگشت به لیست</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          افزودن کاربر جدید
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          فرم زیر را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
        <UserForm
          onSubmit={handleCreate}
          isEdit={false}
          submitLabel="ایجاد کاربر"
        />
      </div>
    </div>
  );
}