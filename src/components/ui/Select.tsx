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
        className={`px-3 py-2 rounded-lg border text-sm bg-custom-card
          text-custom-text appearance-none
          focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500" : "border-custom-border"}`}
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23e5e7eb' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem"
        }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}