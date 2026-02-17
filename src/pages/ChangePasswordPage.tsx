import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { parseApiErrors } from "../utils/helpers";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ current_password:"", new_password:"", confirm_password:"" });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setErrors({});
    const errs: Record<string,string> = {};
    if (!form.current_password)  errs.current_password  = "رمز فعلی الزامی است.";
    if (!form.new_password)      errs.new_password      = "رمز جدید الزامی است.";
    else if (form.new_password.length < 8) errs.new_password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (!form.confirm_password)  errs.confirm_password  = "تکرار رمز الزامی است.";
    else if (form.new_password !== form.confirm_password) errs.confirm_password = "رمزها یکسان نیستند.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await authService.changePasswordWithToken(form.current_password, form.new_password, form.confirm_password);
      toast.success("رمز عبور با موفقیت تغییر یافت.");
      navigate("/users");
    } catch (err) {
      const p = parseApiErrors(err);
      setErrors(p);
      if (p.__general__) toast.error(p.__general__);
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-custom-background flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-custom-card rounded-2xl shadow-xl border border-custom-border">
        <div className="px-8 py-6 border-b border-custom-border">
          <h1 className="text-xl font-bold text-custom-text">تغییر رمز عبور</h1>
          <p className="text-sm text-custom-muted mt-1">رمز عبور جدید خود را تنظیم کنید.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate className="px-8 py-6 space-y-5">
          {errors.__general__ && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {errors.__general__}
            </div>
          )}
          <Input label="رمز فعلی" name="current_password" type="password" value={form.current_password}
            onChange={(e) => setForm((p) => ({ ...p, current_password: e.target.value }))}
            error={errors.current_password} placeholder="••••••••" required />
          <Input label="رمز جدید" name="new_password" type="password" value={form.new_password}
            onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))}
            error={errors.new_password} placeholder="حداقل ۸ کاراکتر" hint="حداقل ۸ کاراکتر" required />
          <Input label="تکرار رمز جدید" name="confirm_password" type="password" value={form.confirm_password}
            onChange={(e) => setForm((p) => ({ ...p, confirm_password: e.target.value }))}
            error={errors.confirm_password} placeholder="••••••••" required />
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1" size="lg">تغییر رمز</Button>
            <Button variant="secondary" size="lg" onClick={() => { logout(); navigate("/login"); }}>خروج</Button>
          </div>
        </form>
      </div>
    </div>
  );
}