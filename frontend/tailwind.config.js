/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#fdf8ec",
          100: "#faefce",
          200: "#f5dfa8",
          300: "#efc97a",
          400: "#e5ad3e",
          500: "#1460b4",
          600: "#0a4a8c",
          700: "#043464",
          800: "#02193a",
          900: "#010e22",
        },
        accent: {
          orange: "#e5ad3e",
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
