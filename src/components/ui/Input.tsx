import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface Props {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  className?: string;
}

export default function Input({
  label, name, type = "text", value, onChange, error,
  placeholder, required, disabled, hint, className = "",
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const renderType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium ">
          {label}{required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <input
          id={name} name={name} type={renderType}
          value={value} onChange={onChange}
          placeholder={placeholder}
          disabled={disabled} required={required}
          className={`px-3 py-2 rounded-lg border text-sm bg-custom-card
            text-custom-text placeholder:text-custom-muted
            focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full
            ${error ? "border-red-500 focus:ring-red-500" : "border-custom-border"}
            ${isPassword ? "pl-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 left-3 my-auto text-custom-muted hover:text-custom-text"
            tabIndex={-1}
            aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}
            disabled={disabled}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      {hint && !error && <p className="text-xs text-custom-muted">{hint}</p>}
      {error          && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}