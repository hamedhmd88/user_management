import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { useToast } from "../contexts/ToastContext";
import UserForm from "../components/users/UserForm";
import Button from "../components/ui/Button";

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
        <Button
        variant="ghost"
        size="md"
          onClick={() => navigate("/users")}
          className="flex items-center border-1 gap-1.5 text-sm text-custom-muted hover:text-custom-accent transition-colors mr-auto"
        >
          <span>بازگشت به لیست</span>
          <span>←</span>
        </Button>
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