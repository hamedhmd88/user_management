import React from "react";

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
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}{required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <input
        id={name} name={name} type={type}
        value={value} onChange={onChange}
        placeholder={placeholder}
        disabled={disabled} required={required}
        className={`px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600"}`}
      />
      {hint && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
      {error          && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}