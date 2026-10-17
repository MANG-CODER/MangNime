/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.08)" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
      },
      colors: {
        celestia: {
          night: "#161218", // Warm Espresso Mauve
          deep: "#211B24", // Velvet Mocha
          royal: "#2D2432", // Elevated Hover Surface
          lavender: "#F4B8C6", // Vogue Peach-Blush Pink
          lilac: "#FADCE4", // Soft Pearl Pink
          sky: "#B8C4D4", // Victorian Dusty Slate Blue
          gold: "#F7D6C4", // Warm Champagne Peach
          pink: "#E88D9E", // Dusty Coral Rose
        },
        vogue: {
          bg: "#161218",
          surface: "#211B24",
          elevated: "#2B232F",
          blush: "#F4B8C6",
          rose: "#E88D9E",
          pearl: "#FDF6F7",
          slate: "#B8C4D4",
          champagne: "#F7D6C4",
          muted: "#AD9CA6",
        },
      },
      fontFamily: {
        heading: ["var(--font-jakarta)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        "glow-purple": "0 10px 30px -5px rgba(244, 184, 198, 0.18)",
        "glow-gold": "0 8px 24px -4px rgba(247, 214, 196, 0.2)",
        "glow-blue": "0 8px 24px -4px rgba(184, 196, 212, 0.18)",
        "vogue-card": "0 16px 36px -12px rgba(8, 5, 10, 0.75)",
        "vogue-blush": "0 8px 25px -4px rgba(244, 184, 198, 0.35)",
      },
    },
  },
  plugins: [],
};
