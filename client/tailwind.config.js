/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // This ensures Tailwind scans React components for classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
