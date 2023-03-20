/** @type {import('tailwindcss/types/config').Config} */
const colors = require("tailwind-config-untitledui").default;

module.exports = {
  content: ["./stories/*.{jsx,js,tsx,ts}"],
  theme: {
    colors: colors,
    extend: {
      spacing: {
        4.5: "1.125rem",
      },
      outlineOffset: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
