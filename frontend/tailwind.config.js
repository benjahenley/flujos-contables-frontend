module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#505081",
        "primary-light": "#8686AC",
        "primary-dark": "#272757",
        "primary-deep": "#0F0E47",
        gray: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        white: "#FFFFFF",
        accent: {
          DEFAULT: "#E6E6FA",
          light: "#F3EFFF",
        },
        error: "#F87171",
        success: "#4ADE80",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1.25rem",
      },
      spacing: {
        18: "4.5rem",
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(80, 80, 129, 0.08)",
        focus: "0 0 0 2px #505081",
      },
    },
  },
  plugins: [],
};
