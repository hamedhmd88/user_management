import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { useToast } from "../contexts/ToastContext";
import { isDefaultUser, parseApiErrors } from "../utils/helpers";
import UserForm from "../components/users/UserForm";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/common/ErrorState";
import type { User } from "../types";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const toast     = useToast();
  const [user, setUser]     = useState<User|null>(null);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState<string|null>(null);

  useEffect(() => {
    setLoad(true);
    userService.getUser(id!)
      .then(({ data }) => {
        if (isDefaultUser(data.id, data.username)) {
          toast.warning("کاربران پیش‌فرض سیستم قابل ویرایش نیستند.");
          navigate("/users"); return;
        }
        setUser(data);
      })
      .catch((err) => {
        const msg = parseApiErrors(err).__general__ ?? "خطا در بارگذاری اطلاعات.";
        setError(msg); toast.error(msg);
      })
      .finally(() => setLoad(false));
  }, [id]);

  async function handleEdit(payload: any) {
    await userService.updateUser(id!, payload);
    toast.success("اطلاعات کاربر با موفقیت بروزرسانی شد.");
    navigate("/users");
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (error)   return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!user)   return null;

  const initialData = {
    username: user.username, email: user.email,
    first_name: user.first_name, last_name: user.last_name,
    is_active: user.is_active,
    profile: {
      role: user.profile?.role ?? "user",
      theme: user.profile?.theme ?? "light",
      allowed_submenus: user.profile?.allowed_submenus ?? [],
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/users")}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">
          ← بازگشت
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ویرایش: {user.username}</h1>
          <p className="text-sm text-gray-500 mt-0.5">اطلاعات کاربر را ویرایش کنید.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <UserForm initialData={initialData} onSubmit={handleEdit} isEdit submitLabel="ذخیره تغییرات" />
      </div>
    </div>
  );
}