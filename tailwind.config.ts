import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        ember: {
          DEFAULT: "#E85D3A",
          50: "#FDF0ED",
          100: "#FBDDD6",
          200: "#F6B8A8",
          300: "#F1937A",
          400: "#EC6E4C",
          500: "#E85D3A",
          600: "#D4421F",
          700: "#A33419",
          800: "#722512",
          900: "#41150A",
        },
        saffron: {
          DEFAULT: "#F4A934",
          50: "#FEF6E7",
          100: "#FDEACC",
          200: "#FAD699",
          300: "#F7C166",
          400: "#F4A934",
          500: "#E89510",
          600: "#B6750D",
          700: "#845509",
          800: "#523506",
          900: "#201503",
        },
        sage: {
          DEFAULT: "#7BAE7F",
          50: "#F0F6F0",
          100: "#DFECDF",
          200: "#BFD9C0",
          300: "#9FC6A0",
          400: "#7BAE7F",
          500: "#5E9962",
          600: "#4A7A4E",
          700: "#375B3A",
          800: "#243D26",
          900: "#121E13",
        },
        midnight: {
          DEFAULT: "#1A1A2E",
          50: "#E8E8ED",
          100: "#D1D1DB",
          200: "#A3A3B7",
          300: "#757593",
          400: "#4D4D6A",
          500: "#1A1A2E",
          600: "#151525",
          700: "#10101C",
          800: "#0B0B13",
          900: "#06060A",
        },
        cream: {
          DEFAULT: "#FFF8F0",
          50: "#FFFFFF",
          100: "#FFF8F0",
          200: "#FFEED9",
          300: "#FFE4C2",
          400: "#FFDAAB",
          500: "#FFD094",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["DM Sans", "sans-serif"],
        display: ["Fraunces", "serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
