export const DEFAULT_USER_IDS = [1,2,3,4,5,6,7,8,9,10,11];
export const DEFAULT_USERNAMES = [
  "admin","admin1","admin2","admin3","admin4",
  "admin5","admin6","admin7","admin8","admin9","admin10",
];

export function isDefaultUser(id: number, username: string): boolean {
  return DEFAULT_USER_IDS.includes(Number(id)) || DEFAULT_USERNAMES.includes(username);
}

export function parseApiErrors(error: any): Record<string, string> {
  if (!error.response) return { __general__: "خطای شبکه. لطفاً اتصال اینترنت را بررسی کنید." };
  const { status, data } = error.response;
  if (status === 429) return { __general__: "تعداد درخواست‌ها بیش از حد مجاز است. کمی صبر کنید." };
  if (status === 500) return { __general__: "خطای داخلی سرور. با پشتیبانی تماس بگیرید." };
  if (status === 403) return { __general__: "دسترسی غیرمجاز." };
  if (status === 404) return { __general__: "منبع مورد نظر یافت نشد." };

  if (data && typeof data === "object") {
    const errs: Record<string, string> = {};
    Object.entries(data).forEach(([key, val]) => {
      errs[key] = Array.isArray(val) ? (val as string[]).join(" ") : String(val);
    });
    return errs;
  }
  return { __general__: "خطای ناشناخته‌ای رخ داد." };
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("fa-IR", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch {
    return dateStr;
  }
}