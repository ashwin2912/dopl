/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Courier New", "Monaco", "Consolas", "monospace"],
        system: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        "retro-bg": "#c0c0c0",
        "retro-dark": "#333333",
        "retro-light": "#ffffff",
        "retro-gray": "#808080",
        "retro-blue": "#0000cd",
        "retro-accent": "#00ff00",
        "retro-border": "#000000",
      },
    },
  },
  plugins: [],
};
