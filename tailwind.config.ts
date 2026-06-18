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
        jb: {
          primary: "#2563EB",
          "primary-dark": "#1D4ED8",
          "primary-light": "#EFF6FF",
          success: "#059669",
          "success-light": "#ECFDF5",
          warning: "#D97706",
          "warning-light": "#FFFBEB",
          danger: "#DC2626",
          "danger-light": "#FEF2F2",
          muted: "#F8FAFC",
          border: "#E2E8F0",
          text: "#0F172A",
          "text-muted": "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
