import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { formatDate } from "../utils/helpers";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm]       = useState({ username: "", password: "" });
  const [errors, setErrors]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lockInfo, setLockInfo] = useState<any>(null);

  useEffect(() => { if (user) navigate("/users", { replace: true }); }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({}); setLockInfo(null);

    const errs: Record<string, string> = {};
    if (!form.username.trim()) errs.username = "نام کاربری الزامی است.";
    if (!form.password)        errs.password = "رمز عبور الزامی است.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/users", { replace: true });
    } catch (err: any) {
      const res = err.response;
      if (!res) { setErrors({ __general__: "خطای شبکه. اتصال اینترنت را بررسی کنید." }); return; }
      const { status, data } = res;
      if (status === 401) {
        if (data?.detail?.toLowerCase().includes("expired") || data?.password_expired) {
          toast.warning("رمز عبور منقضی شده. لطفاً رمز جدید تنظیم کنید.");
          navigate("/change-password"); return;
        }
        setErrors({ __general__: data?.detail || "نام کاربری یا رمز عبور اشتباه است." });
      } else if (status === 403) {
        setLockInfo({ until: data?.locked_until, minutes: data?.locked_for_minutes, msg: data?.detail || "حساب قفل شده است." });
      } else if (status === 400) {
        const e: Record<string,string> = {};
        if (data?.username) e.username = [data.username].flat().join(" ");
        if (data?.password) e.password = [data.password].flat().join(" ");
        if (data?.non_field_errors) e.__general__ = [data.non_field_errors].flat().join(" ");
        setErrors(e);
      } else {
        setErrors({ __general__: "خطای ناشناخته." });
      }
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
            <div className="text-5xl mb-3">🛡️</div>
            <h1 className="text-2xl font-bold text-white">ورود به سیستم</h1>
            <p className="text-blue-100 text-sm mt-1">SafePoint SIEM</p>
          </div>
          <form onSubmit={handleSubmit} noValidate className="px-8 py-8 space-y-5">
            {lockInfo && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm">
                <p className="font-semibold text-red-700 dark:text-red-400 mb-1">🔒 {lockInfo.msg}</p>
                {lockInfo.minutes && <p className="text-red-600 dark:text-red-400">مدت قفل: {lockInfo.minutes} دقیقه</p>}
                {lockInfo.until  && <p className="text-red-600 dark:text-red-400">تا: {formatDate(lockInfo.until)}</p>}
              </div>
            )}
            {errors.__general__ && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {errors.__general__}
              </div>
            )}
            <Input label="نام کاربری" name="username" value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
              error={errors.username} placeholder="نام کاربری" required />
            <Input label="رمز عبور" name="password" type="password" value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={errors.password} placeholder="••••••••" required />
            <Button type="submit" loading={loading} className="w-full" size="lg">ورود</Button>
          </form>
        </div>
      </div>
    </div>
  );
}