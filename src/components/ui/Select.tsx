import React from "react";

interface Option { value: string; label: string; }

interface Props {
  label?: string; name: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[]; error?: string;
  required?: boolean; disabled?: boolean; className?: string;
}

export default function Select({ label, name, value, onChange, options, error, required, disabled, className = "" }: Props) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}{required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <select
        id={name} name={name} value={value}
        onChange={onChange} disabled={disabled}
        className={`px-3 py-2 rounded-lg border text-sm bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}