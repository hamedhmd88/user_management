export const DEFAULT_USER_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
export const DEFAULT_USERNAMES = [
  "admin",
  "admin1",
  "admin2",
  "admin3",
  "admin4",
  "admin5",
  "admin6",
  "admin7",
  "admin8",
  "admin9",
  "admin10",
];

export function isDefaultUser(id: number, username: string): boolean {
  return (
    DEFAULT_USER_IDS.includes(Number(id)) ||
    DEFAULT_USERNAMES.includes(username)
  );
}

export function parseApiErrors(error: unknown): Record<string, string> {
  const response =
    error && typeof error === "object" && "response" in error
      ? (error as { response?: unknown }).response
      : undefined;

  if (!response || typeof response !== "object") {
    return { __general__: "خطای شبکه. لطفاً اتصال اینترنت را بررسی کنید." };
  }

  const status =
    "status" in response &&
    typeof (response as { status?: unknown }).status === "number"
      ? (response as { status: number }).status
      : undefined;

  const data =
    "data" in response ? (response as { data?: unknown }).data : undefined;

  if (status === undefined) {
    return { __general__: "خطای شبکه. لطفاً اتصال اینترنت را بررسی کنید." };
  }
  if (status === 429)
    return {
      __general__: "تعداد درخواست‌ها بیش از حد مجاز است. کمی صبر کنید.",
    };
  if (status === 500)
    return { __general__: "خطای داخلی سرور. با پشتیبانی تماس بگیرید." };
  if (status === 403) return { __general__: "دسترسی غیرمجاز." };
  if (status === 404) return { __general__: "منبع مورد نظر یافت نشد." };

  if (data && typeof data === "object") {
    const translate = (s: string): string => {
      const t = s.toLowerCase();
      if (t.includes("this field is required")) return "این فیلد الزامی است.";
      if (t.includes("may not be blank")) return "این فیلد نمی‌تواند خالی باشد.";
      if (t.includes("enter a valid email")) return "لطفاً یک ایمیل معتبر وارد کنید.";
      if (t.includes("user with that username already exists")) return "کاربری با این نام کاربری وجود دارد.";
      if (t.includes("password is too short")) return "رمز عبور خیلی کوتاه است. حداقل ۸ کاراکتر.";
      if (t.includes("at least 8")) return "رمز عبور باید حداقل ۸ کاراکتر باشد.";
      if (t.includes("too common")) return "این رمز عبور بسیار رایج است.";
      if (t.includes("entirely numeric")) return "رمز عبور نباید فقط شامل ارقام باشد.";
      if (t.includes("uppercase")) return "باید حداقل یک حرف بزرگ داشته باشد.";
      if (t.includes("lowercase")) return "باید حداقل یک حرف کوچک داشته باشد.";
      if (t.includes("digit") || t.includes("number")) return "باید حداقل یک رقم داشته باشد.";
      if (t.includes("special character")) return "باید حداقل یک کاراکتر خاص داشته باشد.";
      return s;
    };

    const errs: Record<string, string> = {};
    Object.entries(data).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        errs[key] = (val as unknown[]).map((x) => translate(String(x))).join(" ");
      } else {
        errs[key] = translate(String(val));
      }
    });
    return errs;
  }
  return { __general__: "خطای ناشناخته‌ای رخ داد." };
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function coerceBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true" || v === "1" || v === "yes") return true;
    if (v === "false" || v === "0" || v === "no") return false;
  }
  return Boolean(value);
}

// Helper برای اطمینان از وجود توکن معتبر
export const ensureValidToken = async (): Promise<boolean> => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;
  
  // اگر توکن وجود داره ولی expired هست، سعی کن رفرش کنی
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return false;
  
  try {
    // این فقط یه چک ساده هست، اگر نیاز به رفرش باشه توسط interceptor انجام می‌شه
    return true;
  } catch {
    return false;
  }
};

// Helper برای صبر کردن تا auth state آماده بشه
export const waitForAuth = async (maxWait = 2000): Promise<boolean> => {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    const token = localStorage.getItem("access_token");
    if (token) return true;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return false;
};
