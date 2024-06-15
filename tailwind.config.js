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
    },
    variants: {
      extend: {},
    },
  },
  plugins: [],
};
