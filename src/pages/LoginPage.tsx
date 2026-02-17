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
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lockInfo, setLockInfo] = useState<{
    until?: string;
    minutes?: number;
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (user) navigate("/users", { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLockInfo(null);

    const errs: Record<string, string> = {};
    if (!form.username.trim()) errs.username = "نام کاربری الزامی است.";
    if (!form.password) errs.password = "رمز عبور الزامی است.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate("/users", { replace: true });
    } catch (err: unknown) {
      const res =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: unknown }).response
          : undefined;
      if (!res) {
        setErrors({ __general__: "خطای شبکه. اتصال اینترنت را بررسی کنید." });
        return;
      }
      const status =
        typeof (res as { status?: unknown }).status === "number"
          ? (res as { status: number }).status
          : undefined;
      const data = (res as { data?: unknown }).data;
      const d =
        data && typeof data === "object"
          ? (data as Record<string, unknown>)
          : {};
      const detail = typeof d.detail === "string" ? d.detail : undefined;
      if (status === 401) {
        const passwordExpired =
          typeof d.password_expired === "boolean" ? d.password_expired : false;
        if (detail?.toLowerCase().includes("expired") || passwordExpired) {
          toast.warning("رمز عبور منقضی شده. لطفاً رمز جدید تنظیم کنید.");
          navigate("/change-password");
          return;
        }
        setErrors({
          __general__: detail || "نام کاربری یا رمز عبور اشتباه است.",
        });
      } else if (status === 403) {
        setLockInfo({
          until:
            typeof d.locked_until === "string" ? d.locked_until : undefined,
          minutes:
            typeof d.locked_for_minutes === "number"
              ? d.locked_for_minutes
              : undefined,
          msg: detail || "حساب قفل شده است.",
        });
      } else if (status === 400) {
        const joinErrors = (v: unknown) =>
          Array.isArray(v) ? v.map(String).join(" ") : v ? String(v) : "";
        const e: Record<string, string> = {};
        if (d.username) e.username = joinErrors(d.username);
        if (d.password) e.password = joinErrors(d.password);
        if (d.non_field_errors) e.__general__ = joinErrors(d.non_field_errors);
        setErrors(e);
      } else {
        setErrors({ __general__: "خطای ناشناخته." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-custom-card via-custom-card to-custom-hover dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        <div className="bg-custom-card rounded-2xl shadow-xl border border-custom-border overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-center">
            <div className="text-5xl mb-3">🛡️</div>
            <h1 className="text-2xl font-bold text-white">ورود به سیستم</h1>
            <p className="text-blue-100 text-sm mt-1">SafePoint SIEM</p>
          </div>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="px-8 py-8 space-y-5"
          >
            {lockInfo && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm">
                <p className="font-semibold text-red-700 dark:text-red-400 mb-1">
                  🔒 {lockInfo.msg}
                </p>
                {lockInfo.minutes && (
                  <p className="text-red-600 dark:text-red-400">
                    مدت قفل: {lockInfo.minutes} دقیقه
                  </p>
                )}
                {lockInfo.until && (
                  <p className="text-red-600 dark:text-red-400">
                    تا: {formatDate(lockInfo.until)}
                  </p>
                )}
              </div>
            )}
            {errors.__general__ && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                {errors.__general__}
              </div>
            )}
            <Input
              label="نام کاربری"
              name="username"
              value={form.username}
              onChange={(e) =>
                setForm((p) => ({ ...p, username: e.target.value }))
              }
              error={errors.username}
              placeholder="نام کاربری"
              required
            />
            <Input
              label="رمز عبور"
              name="password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((p) => ({ ...p, password: e.target.value }))
              }
              error={errors.password}
              placeholder="••••••••"
              required
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-blue-700 text-white hover:bg-blue-800 border-2"
              size="lg"
            >
              ورود
            </Button>

            <div className="mt-4 p-3 bg-custom-card border border-custom-border rounded-lg">
              <h3 className="text-sm font-semibold mb-2">نام کاربری و رمز عبور دمو</h3>
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-custom-muted">نام کاربری:</span>
                    <span dir="ltr" className="font-mono mx-2">admin</span>
                  </div>
                  <div>
                    <span className="text-custom-muted">رمز عبور:</span>
                    <span dir="ltr" className="font-mono mx-2">1qaz!QAZ</span>
                  </div>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setForm({ username: "admin", password: "1qaz!QAZ" })}
                  className="shrink-0"
                  title="پر کردن خودکار فرم با اطلاعات دمو"
                >
                  استفاده از دمو
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
