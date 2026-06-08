/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#D3F2E9",
          100: "#BBE9DF",
          200: "#9DDDD3",
          300: "#7ECEC5",
          400: "#7CA8A1",
          500: "#0A7B79",
          600: "#086462",
          700: "#064E4C",
          800: "#043836",
          900: "#022220",
        },
        accent: {
          orange: "#F4A363",
          coral: "#DB767D",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
