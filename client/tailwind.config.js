/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px', // Small mobile
      },
      fontFamily: {
        sans: ['"Instrument Sans"', 'sans-serif'],
        serif: ['"EB Garamond"', 'serif'],
      },
      colors: {
        paper: '#F9F8F3', // Cream
        ink: '#2D2D2D',   // Charcoal
      },
      transitionTimingFunction: {
        'bounce-custom': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
}
