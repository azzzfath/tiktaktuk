import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        secondary: "#8B5CF6",
        accent: "#06B6D4",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        muted: "#71717A",
        background: {
          dark: "#0F0F0F",
          light: "#FAFAFA",
        },
        surface: {
          dark: "#1A1A1A",
          light: "#FFFFFF",
        },
        text: {
          dark: "#F4F4F5",
          light: "#18181B",
        }
      },
    },
  },
  plugins: [],
};
export default config;
