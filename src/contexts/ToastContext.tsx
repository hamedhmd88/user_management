import React, {
  createContext, useCallback, useContext,
  useMemo, useState,
} from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastAPI {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastCtx = createContext<ToastAPI | null>(null);

const COLORS: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error:   "bg-red-600 text-white",
  warning: "bg-yellow-500 text-white",
  info:    "bg-blue-600 text-white",
};
const ICONS: Record<ToastType, string> = {
  success: "✓", error: "✕", warning: "⚠", info: "ℹ",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const add = useCallback((message: string, type: ToastType, dur = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), dur);
  }, []);

  const remove = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  const toast = useMemo<ToastAPI>(() => ({
    success: (m) => add(m, "success"),
    error:   (m) => add(m, "error"),
    warning: (m) => add(m, "warning"),
    info:    (m) => add(m, "info"),
  }), [add]);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in ${COLORS[t.type]}`}
          >
            <span className="text-base font-bold leading-none mt-0.5">{ICONS[t.type]}</span>
            <p className="flex-1 text-sm leading-snug">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="opacity-70 hover:opacity-100 text-lg leading-none"
            >×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx)!;