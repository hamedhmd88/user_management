import React, { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onClose: (id: number) => void;
}

// ── Config ─────────────────────────────────────────────────────

const STYLES: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: {
    bg:   "bg-custom-card border-l-4 border-green-500",
    icon: "✓",
    bar:  "bg-green-500",
  },
  error: {
    bg:   "bg-custom-card border-l-4 border-red-500",
    icon: "✕",
    bar:  "bg-red-500",
  },
  warning: {
    bg:   "bg-custom-card border-l-4 border-yellow-500",
    icon: "⚠",
    bar:  "bg-yellow-500",
  },
  info: {
    bg:   "bg-custom-card border-l-4 border-blue-500",
    icon: "ℹ",
    bar:  "bg-blue-500",
  },
};

const ICON_COLORS: Record<ToastType, string> = {
  success: "text-green-500",
  error:   "text-red-500",
  warning: "text-yellow-500",
  info:    "text-blue-500",
};

const TITLE: Record<ToastType, string> = {
  success: "موفق",
  error:   "خطا",
  warning: "هشدار",
  info:    "اطلاعات",
};

// ── Single Toast ───────────────────────────────────────────────

export function Toast({ toast, onClose }: ToastProps) {
  const { id, message, type, duration = 4000 } = toast;
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const style = STYLES[type];

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Progress bar countdown
  useEffect(() => {
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [duration]);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onClose(id), 300);
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative overflow-hidden rounded-lg shadow-lg
        ${style.bg}
        border border-custom-border
        transition-all duration-300 ease-in-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {/* Content */}
      <div className="flex items-start gap-3 px-4 py-3">
        {/* Icon */}
        <div
          className={`text-lg font-bold leading-none mt-0.5 shrink-0 ${ICON_COLORS[type]}`}
        >
          {style.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-custom-muted mb-0.5">
            {TITLE[type]}
          </p>
          <p className="text-sm text-custom-text leading-snug break-words">
            {message}
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="بستن"
          className="shrink-0 text-custom-muted hover:text-custom-text transition-colors text-lg leading-none mt-0.5"
        >
          ×
        </button>
      </div>

      {/* Progress bar */}
      <div
        className={`h-0.5 ${style.bar} transition-all ease-linear`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ── Toast Container ────────────────────────────────────────────
// این کامپوننت داخل ToastContext.tsx استفاده میشه
// اما میتونی standalone هم ازش استفاده کنی

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: number) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div
      aria-label="اعلان‌ها"
      className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

export default Toast;