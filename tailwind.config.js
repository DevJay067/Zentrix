/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zx: {
          primary: "var(--zx-primary)",
          primaryDeep: "var(--zx-primary-deep)",
          cream: "var(--zx-cream)",
          ink: "var(--zx-ink)",
          muted: "var(--zx-muted)",
          surface: "var(--zx-surface)",
          surfaceAlt: "var(--zx-surface-alt)",
          success: "var(--zx-success)",
          warning: "var(--zx-warning)",
          danger: "var(--zx-danger)",
          border: "var(--zx-border)",
        },
      },
    },
  },
  plugins: [],
};
