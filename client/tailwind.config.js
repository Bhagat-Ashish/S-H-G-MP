/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary : "#40513B"
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable default Tailwind CSS preflight styles to avoid conflicts with other libraries
  }
}