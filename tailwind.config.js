/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'flow-line': 'flow-line 1s linear infinite',
      },
    },
  },
  plugins: [],
}