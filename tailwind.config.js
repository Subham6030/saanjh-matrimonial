/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'rgb(var(--bg-primary-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--bg-secondary-rgb) / <alpha-value>)',
          card: 'rgb(var(--bg-card-rgb) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated-rgb) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand-primary-rgb) / <alpha-value>)',
          hover: 'rgb(var(--brand-hover-rgb) / <alpha-value>)',
          accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--brand-secondary-rgb) / <alpha-value>)',
        },
        ink: {
          primary: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
          muted: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        },
        line: 'rgb(var(--border-rgb) / <alpha-value>)',
        success: 'rgb(var(--success-rgb) / <alpha-value>)',
        error: 'rgb(var(--error-rgb) / <alpha-value>)',
        warning: 'rgb(var(--warning-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.2em',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(31, 39, 51, 0.04), 0 12px 32px -18px rgba(31, 39, 51, 0.16)',
        lift: '0 2px 4px rgba(31, 39, 51, 0.05), 0 24px 48px -24px rgba(31, 39, 51, 0.26)',
        float: '0 18px 50px -24px rgba(31, 39, 51, 0.35)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '40%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-in-left': 'slide-in-left 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'toast-in': 'toast-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
        'bounce-dot': 'bounce-dot 1.2s infinite ease-in-out',
      },
      backgroundImage: {
        'hero-wash':
          'radial-gradient(ellipse 70% 60% at 82% 12%, rgb(var(--accent-rgb) / 0.16), transparent 60%), radial-gradient(ellipse 60% 60% at 8% 88%, rgb(var(--brand-secondary-rgb) / 0.12), transparent 60%)',
      },
    },
  },
  plugins: [],
}
