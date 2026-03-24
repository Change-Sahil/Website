/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "rgb(0,168,165)",
          90: "rgba(0,168,165,0.90)",
          92: "rgba(0,168,165,0.92)",
          95: "rgba(0,168,165,0.95)",
        },
        accent2: {
          DEFAULT: "rgb(0,112,125)",
        },
      },
    }
  },
  plugins: []
};
