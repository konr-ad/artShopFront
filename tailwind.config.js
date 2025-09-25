/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontWeight: {
        'extra-bold': '800',
      },
      keyframes: {
        'modal-in': {
          '0%':   { opacity: '0', transform: 'translateY(6px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'modal-in': 'modal-in 220ms cubic-bezier(.22,.8,.36,1) both',
        'fade-in': 'fade-in 200ms ease-out both',
      },
    },
    variants: {
      extend: {},
    },
  },
  plugins: [],
};
