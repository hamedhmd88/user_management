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
          className="flex items-center gap-1.5 text-sm text-custom-muted hover:text-custom-accent transition-colors"
        >
          <span>←</span>
          <span>بازگشت به لیست</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-custom-text">
          افزودن کاربر جدید
        </h1>
        <p className="text-sm text-custom-muted mt-1">
          فرم زیر را تکمیل کنید. فیلدهای ستاره‌دار الزامی هستند.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-custom-card rounded-xl border border-custom-border shadow-sm p-6 sm:p-8">
        <UserForm
          onSubmit={handleCreate}
          isEdit={false}
          submitLabel="ایجاد کاربر"
        />
      </div>
    </div>
  );
}