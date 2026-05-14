/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out forwards",
      },
      colors: {
        celestia: {
          deep: "#2B1E59",
          royal: "#5538A8",
          lavender: "#8B6CFF",
          lilac: "#C6B3FF",
          sky: "#4CC9FF",
          gold: "#FFD98A",
          pink: "#FF78C6",
          night: "#0D0B1A",
        },
      },
      fontFamily: {
        heading: ["var(--font-outfit)", "sans-serif"],
        body: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.3)",
        "glow-gold": "0 0 20px rgba(255, 217, 138, 0.2)",
      },
    },
  },
  plugins: [],
};
