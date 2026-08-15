import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#d9e8ff",
          300: "#7fb0ff",
          500: "#2f6fed",
          700: "#1a3f99",
          900: "#0b1a3a",
        },
        surface: {
          light: "rgba(255,255,255,0.55)",
          dark: "rgba(12,16,28,0.55)",
        },
      },
      backdropBlur: {
        glass: "18px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.25)",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        gradientShift: "gradientShift 12s ease infinite",
      },
    },
  },
  plugins: [],
};

export default config;
