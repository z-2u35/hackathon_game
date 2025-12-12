/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./libs/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Pixel theme
        obsidian: "#1A1F2B",
        voidlayer: "#0F141B",
        steel: "#2D3A4A",

        amber: "#D4A94E",
        deepamber: "#B38A3B",
        mistsilver: "#A8B3C3",
        slateblue: "#627086",

        textmain: "#E9ECF2",
        textsub: "#C0C5CF",

        success: "#4CAF50",
        error: "#E57373",
        warning: "#FFB84D",
      },

      fontFamily: {
        pixel: ["'Press Start 2P'", "ui-monospace"],
      },

      boxShadow: {
        pixel: "0 0 0 3px #000",
      },

      scale: {
        102: "1.02",
        105: "1.05",
      },

      keyframes: {
        shootingStar: {
          '0%': { transform: 'translate(0,0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: '0' },
        },
      },
      animation: {
        shootingStar: 'shootingStar 1.5s linear infinite',
      },
    },
  },
  plugins: [],
};
