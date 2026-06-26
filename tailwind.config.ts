import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          500: "#06b6d4",
          700: "#0e7490",
          900: "#164e63"
        }
      }
    }
  },
  plugins: []
};

export default config;
