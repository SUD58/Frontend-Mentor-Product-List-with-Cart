/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html, js}"],
  theme: {
    extend: {
      colors: {
        Frontend: {
          Red: "hsl(14, 86%, 42%)",
          Green: "hsl(159, 69%, 38%)",
          Rose: {
            50: "hsl(20, 50%, 98%)",
            100: "hsl(13, 31%, 94%)",
            300: "hsl(14, 25%, 72%)",
            400: "hsl(7, 20%, 60%)",
            500: "hsl(12, 20%, 44%)",
            500: "hsl(12, 20%, 44%)",
          },
        },
      },
      fontFamily: {
        RedHat: ['"Red Hat Text"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
