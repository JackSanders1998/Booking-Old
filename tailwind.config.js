// tailwind.config.js
const colors = require("tailwindcss/colors")

module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  // darkMode: "class",
  theme: {
    fontFamily: {
      readex: ["Readex Pro", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        teal: colors.teal,
        cyan: colors.cyan,
        "slate-01": "#151718",
        "slate-02": "#1A1D1E",
        "slate-03": "#202425",
        "slate-04": "#26292B",
        "slate-06": "#313538",
        "slate-07": "#3A3F42",
        "slate-08": "#4C5155",
        "slate-09": "#697177",
        "slate-10": "#787F85",
        "slate-11": "#9BA1A6",
        "slate-12": "#ECEDEE",
        "violet-01": "#17151F",
        "violet-11": "#9E8CFC",
      },
    },
  },
  plugins: [
    // require("@tailwindcss/forms"), require("@tailwindcss/aspect-ratio")
  ],
}
