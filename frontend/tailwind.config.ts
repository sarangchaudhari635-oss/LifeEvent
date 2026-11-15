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
        paytm: {
          navy: "#002970",
          navyDark: "#001b47",
          cyan: "#00baf2",
          cyanLight: "#e1f6fd",
          sky: "#f0f7ff",
          text: "#0d1b2a",
          muted: "#475569",
          border: "#cbd5e1",
          warning: "#92400e", // Accessible dark amber for WCAG AA
          warningBg: "#fef3c7",
          success: "#15803d",
          successBg: "#dcfce7",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Noto Sans Devanagari", "sans-serif"],
        display: ["var(--font-display)", "Plus Jakarta Sans", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

