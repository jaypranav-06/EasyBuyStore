import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C2C2C",
          light: "#4A4A4A",
        },
        accent: {
          DEFAULT: "#D4AF37",
          light: "#E6C968",
        },
        secondary: "#8B7355",
        surface: "#F8F8F8",
        border: "#E5E5E5",
        'text-primary': "#2C2C2C",
        'text-secondary': "#6B6B6B",
        success: "#059669",
        error: "#DC2626",
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
