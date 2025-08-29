/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./public/index.html"],
  theme: {
    colors: {
      "text-teal": "#26D1D4",
      "bg-grey-secondary": "#16161b",
    },
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      colors: {
        teal: "#42e6e9",
        "dark-blue": "#407bff",
        violet: "#6f7fdf",
        purple: "#9883bd",
        "aqua-violet": "#a0b5e4",
        "sky-blue": "#45d0e7",
        white: "#f1f1f1",
        "cyan-primary": "#26D1D4",
        "white-primary": "#cfcfcf",
        "grey-primary-outline": "#636363",
        "grey-primary-text": "#bfbfbf",
        "grey-secondary": "#17171b",
        "black-primary": "#02030C",
        "purple-primary": "#6E7FDF",
      },
    },
  },
  plugins: [],
};
