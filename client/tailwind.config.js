/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#60A5FA',
          subtle: 'rgba(59, 130, 246, 0.1)'
        },
        secondary: {
          DEFAULT: '#64748B',
          light: '#94A3B8',
          dark: '#475569'
        },
        accent: {
          DEFAULT: '#06B6D4',
          hover: '#0891B2',
          subtle: 'rgba(6, 182, 212, 0.1)'
        },
        // Dark theme tokens
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          surfaceHover: '#283548',
          border: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8'
        },
        // Light theme tokens
        light: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          surfaceSecondary: '#E2E8F0',
          border: '#CBD5E1',
          text: '#0F172A',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.2)',
        'glow-primary': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
        'glow-accent': '0 0 20px -5px rgba(6, 182, 212, 0.5)'
      }
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('light', ':is(.light, .light *) &');
    }
  ],
}
