import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        input: "hsl(var(--input))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ring: "hsl(var(--ring))",
        muted: {
          foreground: "hsl(var(--muted-foreground))",
        },
      },
    },
  },
  plugins: [],
};

export default config;
