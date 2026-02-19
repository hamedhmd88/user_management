
import axios from "axios";

const BASE_URL = "/siem/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v: string) => void;
  reject: (e: any) => void;
}> = [];

function processQueue(error: any, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

// ── Attach token ───────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Refresh on 401 ─────────────────────────────
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!error.response) return Promise.reject(error);

   if (error.response.status === 401 && !original._retry) {
  // رمز عبور منقضی شده
  if (error.response.data?.code === "password_expired") {
    window.location.href = "/change-password";
    return Promise.reject(error);
  }

  // ✅ این رو اضافه کن
//   if (error.response.data?.code === "inactivity_timeout") {
//     localStorage.clear();
//     window.location.href = "/login";
//     return Promise.reject(error);
//   }

      // ❌ اگه خود login 401 داد، refresh نکن
      if (original.url?.includes("/auth/token/") && 
          !original.url?.includes("/auth/token/refresh/")) {
        return Promise.reject(error);
      }

      // ❌ اگه refresh هم 401 داد، برو login
      if (original.url?.includes("/auth/token/refresh/")) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // صف درخواست‌های موازی
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        ).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${BASE_URL}/auth/token/refresh/`,
          { refresh },
          { headers: { "Content-Type": "application/json" } }
        );
        localStorage.setItem("access_token", data.access);
        processQueue(null, data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return api(original);
      } catch (e) {
        processQueue(e, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;