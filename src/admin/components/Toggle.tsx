import React from 'react';

interface ToggleProps {
  value: boolean;
  onChange: () => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ value, onChange, label, description, disabled }: ToggleProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${label ? 'p-3 bg-gray-50 rounded-xl' : ''}`}>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && <p className="text-xs font-semibold text-gray-700 leading-tight">{label}</p>}
          {description && <p className="text-xs text-gray-400 mt-0.5 leading-tight">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={onChange}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${value ? 'bg-emerald-500' : 'bg-gray-300'}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
            transition duration-200 ease-in-out
            ${value ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}
