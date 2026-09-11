import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-200 
        ${isDark 
          ? 'text-slate-300 hover:text-white hover:bg-slate-800' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
        } ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
