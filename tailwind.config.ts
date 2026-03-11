import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", 
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A", 
          light: "#1E293B",
        },
        accent: {
          DEFAULT: "#F59E0B",
          hover: "#D97706",
        },
      },
    },
  },
  plugins: [],
};
export default config;