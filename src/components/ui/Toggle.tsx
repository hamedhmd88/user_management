import React from "react";

interface Props {
  label?: string; checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function Toggle({ label, checked, onChange, disabled }: Props) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} disabled={disabled} />
        <div className={`w-10 h-5 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"}`} />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </div>
      {label && <span className="text-sm text-custom-text">{label}</span>}
    </label>
  );
}