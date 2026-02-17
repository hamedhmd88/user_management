import React from "react";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success";
type Size    = "sm" | "md" | "lg";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  title?: string;
}

const VAR: Record<Variant, string> = {
  primary:   "bg-transparent hover:bg-custom-hover text-custom-text border border-custom-border focus:ring-blue-500",
  secondary: "bg-custom-card hover:bg-custom-hover text-custom-text border border-custom-border focus:ring-gray-400",
  danger:    "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
  ghost:     "bg-transparent hover:bg-custom-hover text-custom-text focus:ring-gray-400",
  success:   "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
};
const SZ: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
};

export default function Button({
  children, onClick, type = "button", variant = "primary",
  size = "md", disabled, loading, className = "", title,
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
        ${VAR[variant]} ${SZ[size]} ${className}`}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}