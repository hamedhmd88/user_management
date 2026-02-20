import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userService } from "../services/userService";
import { useToast } from "../contexts/ToastContext";
import { coerceBoolean, isDefaultUser, parseApiErrors } from "../utils/helpers";
import UserForm from "../components/users/UserForm";
import Spinner from "../components/ui/Spinner";
import ErrorState from "../components/common/ErrorState";
import type { User } from "../types";
import Button from "../components/ui/Button";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoad(true);
    setError(null);

    userService
      .getUser(id!)
      .then(({ data }) => {
        if (!mounted) return;
        if (isDefaultUser(data.id, data.username)) {
          toast.warning("کاربران پیش‌فرض سیستم قابل ویرایش نیستند.");
          navigate("/users");
          return;
        }
        const rec =
          data && typeof data === "object"
            ? (data as Record<string, unknown>)
            : {};
        setUser({
          ...(rec as unknown as User),
          is_active: coerceBoolean(rec.is_active ?? rec.isActive ?? rec.active),
        });
      })
      .catch((err) => {
        if (!mounted) return;
        const msg =
          parseApiErrors(err).__general__ ?? "خطا در بارگذاری اطلاعات.";
        setError(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (!mounted) return;
        setLoad(false);
      });

    return () => {
      mounted = false;
    };
  }, [id, navigate, toast]);

  async function handleEdit(payload: Record<string, unknown>) {
    await userService.updateUser(id!, payload);
    toast.success("اطلاعات کاربر با موفقیت بروزرسانی شد.");
    navigate("/users");
  }

  if (loading)
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  if (error)
    return (
      <ErrorState message={error} onRetry={() => window.location.reload()} />
    );
  if (!user) return null;

  const initialData = {
    username: user.username,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
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
        <div>
          <h1 className="text-2xl font-bold text-custom-text">
            ویرایش: {user.username}
          </h1>
          <p className="text-sm text-custom-muted mt-0.5">
            اطلاعات کاربر را ویرایش کنید.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => navigate("/users")}
          className="text-sm text-custom-muted border  hover:text-custom-accent transition-colors mr-auto"
        >
          بازگشت ←
        </Button>
      </div>
      <div className="bg-custom-card rounded-xl border border-custom-border p-6">
        <UserForm
          initialData={initialData}
          onSubmit={handleEdit}
          isEdit
          submitLabel="ذخیره تغییرات"
        />
      </div>
    </div>
  );
}
