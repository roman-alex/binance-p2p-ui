/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'binance-yellow': '#F0B90B',
        'binance-green': '#02C076',
        'binance-red': '#F84960',
        'dark-bg': '#0B0E11',
        'dark-surface': '#1E2329',
        'dark-border': '#2B3139',
      }
    },
  },
  plugins: [],
}