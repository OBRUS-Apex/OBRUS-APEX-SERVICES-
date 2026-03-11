import type { Config } from "next";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0b1f3a",
          deep: "#060f1e",
          mid: "#0d2648",
        },
        gold: {
          DEFAULT: "#c8921e",
          lt: "#e8b84b",
        },
        green: {
          DEFAULT: "#1a7a4a",
          lt: "#28a866",
        },
        cream: "#f5f0e8",
        slate: "#8494aa",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans: ["Jost", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;