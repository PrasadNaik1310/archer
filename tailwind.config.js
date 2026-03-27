/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          200: '#e2e8f0',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}