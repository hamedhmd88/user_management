import React, { useEffect, useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Toggle from "../ui/Toggle";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import MenuPermissionTree from "./MenuPermissionTree";
import { menuService } from "../../services/menuService";
import { useToast } from "../../contexts/ToastContext";
import { parseApiErrors } from "../../utils/helpers";
import type { Menu } from "../../types";

interface FormState {
  username: string; email: string;
  first_name: string; last_name: string;
  password: string; is_active: boolean;
  profile: { role: "admin"|"user"; theme: "light"|"dark"; allowed_submenus: number[] };
}

interface Props {
  initialData?: Partial<FormState>;
  onSubmit: (payload: any) => Promise<void>;
  isEdit?: boolean;
  submitLabel?: string;
}

export default function UserForm({ initialData, onSubmit, isEdit = false, submitLabel = "ذخیره" }: Props) {
  const toast = useToast();
  const [form, setForm] = useState<FormState>({
    username: "", email: "", first_name: "", last_name: "",
    password: "", is_active: true,
    ...initialData,
    profile: {
      role: "user", theme: "light", allowed_submenus: [],
      ...(initialData?.profile ?? {}),
    },
  });
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [menus, setMenus]         = useState<Menu[]>([]);
  const [menusLoading, setML]     = useState(true);

  useEffect(() => {
    menuService.getMenus()
      .then(({ data }) => setMenus(Array.isArray(data) ? data : data.results ?? []))
      .catch(() => toast.warning("بارگذاری منوها با خطا مواجه شد."))
      .finally(() => setML(false));
  }, []);

  // Auto-select all submenus for admin
  useEffect(() => {
    if (form.profile.role === "admin") {
      const allIds: number[] = [];
      menus.forEach((m) => m.submenus.forEach((s) => allIds.push(s.id)));
      setForm((p) => ({ ...p, profile: { ...p.profile, allowed_submenus: allIds } }));
    }
  }, [form.profile.role, menus]);

  function setField(path: string, value: any) {
    setErrors((p) => { const n = { ...p }; delete n[path]; delete n.__general__; return n; });
    if (path.startsWith("profile.")) {
      const key = path.split(".")[1];
      setForm((p) => ({ ...p, profile: { ...p.profile, [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [path]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!isEdit && !form.username.trim())  errs.username = "نام کاربری الزامی است.";
    if (!form.email.trim())                errs.email    = "ایمیل الزامی است.";
    if (!isEdit && !form.password)         errs.password = "رمز عبور الزامی است.";
    if (!isEdit && form.password && form.password.length < 8)
      errs.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      const payload = isEdit
        ? { first_name: form.first_name, last_name: form.last_name, email: form.email,
            is_active: form.is_active, profile: form.profile }
        : { username: form.username, email: form.email, first_name: form.first_name,
            last_name: form.last_name, password: form.password, is_active: form.is_active,
            profile: form.profile };
      await onSubmit(payload);
    } catch (err) {
      const parsed = parseApiErrors(err);
      setErrors(parsed);
      if (parsed.__general__) toast.error(parsed.__general__);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8" dir="rtl">
      {errors.__general__ && (
        <div className="p-3 rounded-lg border text-sm bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
          {errors.__general__}
        </div>
      )}

      {/* Basic Info */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">اطلاعات پایه</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isEdit && (
            <Input label="نام کاربری" name="username" value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              error={errors.username} required placeholder="john_doe" />
          )}
          <Input label="ایمیل" name="email" type="email" value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            error={errors.email} required placeholder="email@example.com"
            className={isEdit ? "sm:col-span-2" : ""} />
          <Input label="نام" name="first_name" value={form.first_name}
            onChange={(e) => setField("first_name", e.target.value)}
            error={errors.first_name} placeholder="نام" />
          <Input label="نام خانوادگی" name="last_name" value={form.last_name}
            onChange={(e) => setField("last_name", e.target.value)}
            error={errors.last_name} placeholder="نام خانوادگی" />
          {!isEdit && (
            <Input label="رمز عبور" name="password" type="password" value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              error={errors.password} required hint="حداقل ۸ کاراکتر" placeholder="••••••••" />
          )}
        </div>
      </section>

      {/* Role & Status */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">نقش و وضعیت</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <Select label="نقش" name="role" value={form.profile.role}
            onChange={(e) => setField("profile.role", e.target.value as "admin"|"user")}
            options={[{ value:"user", label:"کاربر عادی" }, { value:"admin", label:"مدیر" }]} />
          <Select label="تم" name="theme" value={form.profile.theme}
            onChange={(e) => setField("profile.theme", e.target.value as "light"|"dark")}
            options={[{ value:"light", label:"روشن" }, { value:"dark", label:"تاریک" }]} />
          <Toggle label="کاربر فعال" checked={form.is_active}
            onChange={(e) => setField("is_active", e.target.checked)} />
        </div>
      </section>

      {/* Permissions */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">دسترسی منوها</h3>
        {form.profile.role === "admin" && (
          <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2">
            مدیران به‌طور خودکار به تمام منوها دسترسی کامل دارند.
          </p>
        )}
        {menusLoading
          ? <div className="flex items-center gap-2 py-4"><Spinner size="sm" /><span className="text-sm text-gray-500">در حال بارگذاری منوها...</span></div>
          : <MenuPermissionTree menus={menus} selectedIds={form.profile.allowed_submenus}
              onChange={(ids) => setField("profile.allowed_submenus", ids)}
              disabled={form.profile.role === "admin"} />
        }
      </section>

      <div className="flex justify-end pt-2">
        <Button type="submit" loading={loading} size="lg">{submitLabel}</Button>
      </div>
    </form>
  );
}