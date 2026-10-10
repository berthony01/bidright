/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette: deep slate + safety-orange accent. Solid colors only.
        brand: {
          50: "#eef4ff",
          100: "#dbe7fd",
          600: "#1d4ed8",
          700: "#1e40af",
          900: "#172554",
          950: "#0b1530",
        },
        accent: {
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
