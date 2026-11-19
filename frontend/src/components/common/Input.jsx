import React from 'react';

export const Input = ({
  label,
  error,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  icon: Icon,
  disabled = false,
  ...props
}) => {
  const inputId = id || name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg text-sm transition-colors duration-150
            bg-white dark:bg-[#1E293B]
            text-slate-900 dark:text-[#F8FAFC]
            border ${error ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'}
            focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-500/20 focus:outline-none
            disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/50
            ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      )}
    </div>
  );
};
