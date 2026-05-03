/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Karla', 'system-ui', 'sans-serif'],
        display: ['Playfair Display SC', 'serif'],
      },
      colors: {
        brand: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#641919',
        },
        dark: {
          50:  '#f8f7f4',
          100: '#e8e6e0',
          200: '#ccc8bf',
          300: '#aaa49a',
          400: '#8c8478',
          500: '#706860',
          600: '#59524c',
          700: '#3f3a35',
          800: '#27231f',
          900: '#141210',
          950: '#0a0908',
        },
      },
      animation: {
        'slide-up':       'slideUp 0.35s cubic-bezier(0.32,0.72,0,1)',
        'slide-down':     'slideDown 0.35s cubic-bezier(0.32,0.72,0,1)',
        'fade-in':        'fadeIn 0.25s ease-out',
        'bounce-in':      'bounceIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        'pulse-ring':     'pulseRing 1.5s cubic-bezier(0.215,0.61,0.355,1) infinite',
        'pulse-ring-lg':  'pulseRingLg 2.2s cubic-bezier(0.215,0.61,0.355,1) infinite',
        'toast-enter':    'toastEnter 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        'toast-exit':     'toastExit 0.3s ease-in forwards',
        'success-pop':    'successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        'success-fade':   'successFade 0.35s ease-out forwards',
        'check-draw':     'checkDraw 0.45s cubic-bezier(0.65,0,0.45,1) 0.25s forwards',
        'progress-fill':  'progressFill 1.8s linear forwards',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(100%)', opacity: 0 },
          to:   { transform: 'translateY(0)',    opacity: 1 },
        },
        slideDown: {
          from: { transform: 'translateY(-20px)', opacity: 0 },
          to:   { transform: 'translateY(0)',     opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        bounceIn: {
          from: { transform: 'scale(0.8)', opacity: 0 },
          to:   { transform: 'scale(1)',   opacity: 1 },
        },
        pulseRing: {
          '0%':   { transform: 'scale(1)',    opacity: 0.8 },
          '70%':  { transform: 'scale(1.15)', opacity: 0 },
          '100%': { transform: 'scale(1.15)', opacity: 0 },
        },
        pulseRingLg: {
          '0%':   { transform: 'scale(1)',    opacity: 0.5 },
          '70%':  { transform: 'scale(1.35)', opacity: 0 },
          '100%': { transform: 'scale(1.35)', opacity: 0 },
        },
        toastEnter: {
          from: { transform: 'translateY(20px) scale(0.9)', opacity: 0 },
          to:   { transform: 'translateY(0)    scale(1)',   opacity: 1 },
        },
        toastExit: {
          from: { transform: 'translateY(0)    scale(1)',   opacity: 1 },
          to:   { transform: 'translateY(20px) scale(0.9)', opacity: 0 },
        },
        successPop: {
          '0%':   { transform: 'scale(0.6)',  opacity: 0 },
          '60%':  { transform: 'scale(1.08)', opacity: 1 },
          '100%': { transform: 'scale(1)',    opacity: 1 },
        },
        successFade: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to:   { opacity: 1, transform: 'translateY(0)' },
        },
        checkDraw: {
          from: { strokeDashoffset: 30 },
          to:   { strokeDashoffset: 0 },
        },
        progressFill: {
          from: { width: '0%' },
          to:   { width: '100%' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
