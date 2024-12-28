import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        lightbg:
          "radial-gradient(oklch(45.54% 0.162 281.37/0.2), oklch(45.54% 0.162 281.37/0.5))",
        primaryaccent:
          "linear-gradient(hsl(var(--primary)), hsl(var(--secondary)/0.4))",
        secondaryaccent:
          "radial-gradient(oklch(65.54% 0.162 281.37), oklch(50.07% 0.277 270.83))",
      },
      background: {
        lightps: "hsla(0, 0%, 41%, 1)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        light: "hsl(var(--lightps))",
        nav: "hsl(var(--secondary)/0.2)",
        secondarylight: "hsl(var(--secondary)/0.4)",
        accentmedium: "hsl(var(--accent)/0.6)",
        accentlight: "hsl(var(--accent)/0.4)",
        iconActive: "hsl(var(--iconextremedark))",
        iconDark: "hsl(var(--icondark))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primaryAccent: {
          DEFAULT:
            "linear-gradient(oklch(86.29% 0.077 185.59), oklch(88.89% 0.159 179.83))",
          foreground: "hsl(var(--primaryAccent-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      keyframes: {
        sideDrawer: {
          "0%": { transform: "translateY(-2rem)", opacity: 0 },
          "90%": { transform: "translateY(-1rem)", opacity: 0.5 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        Input: {
          "0%": { transform: "translateY(0.5rem)", opacity: 0, width: "0" },
          "80%": { transform: "translateY(0.5rem)", opacity: 0.5, width: "50" },
          "100%": { transform: "translateY(0)", opacity: 1, width: "100%" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "side-drawer": "sideDrawer 0.4s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
