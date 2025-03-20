import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        default: "white",
        blue_twitter: "rgb(29, 155, 240)",
      },
      screens: {
        "2xl": "1400px",
      },
      borderColor: {
        DEFAULT: "rgb(47, 51, 54)",
      },
    },
  },
  plugins: [],
} satisfies Config;
