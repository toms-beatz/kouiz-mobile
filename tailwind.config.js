/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'unbounded': ['Unbounded', 'sans-serif'],
      },
    },

    colors: {
      'pBlue': '#2E3B52',
      'sBlue': '#232D41',
      'pBeige': '#FFE3CB',
      'sBeige': '#FFF1E5',
      'tBeige': '#FFF9F5',
      'pBrown': '#9D775D',
      'pWhite': '#ffffff',
      'transparent': 'rgba(255, 255, 255, 0)',
      'pGray': "#f1f1f1"
    },
  },
  plugins: [],
}
