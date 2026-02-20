import  { useState, useRef, useEffect } from "react";

interface Option { value: string; label: string; }

interface Props {
  label?: string; name: string;
  value: string; onChange: (value: string) => void;
  options: Option[]; error?: string;
  required?: boolean; disabled?: boolean; className?: string;
}

export default function CustomDropdown({ label, name, value, onChange, options, error, required, disabled, className = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    console.log("CustomDropdown - handleSelect called with:", optionValue);
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}{required && <span className="text-red-500 mr-1">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 rounded-lg border text-sm bg-custom-card text-custom-text text-right
            focus:outline-none focus:ring-2 focus:ring-custom-accent focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between cursor-pointer
            ${error ? "border-red-500" : "border-custom-border"}`}
        >
          <span>{selectedOption?.label || "انتخاب کنید..."}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 text-white
                  ${value === option.value ? "bg-gray-700 font-medium" : ""}`}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}