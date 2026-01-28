/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        realistic: '#FF6B6B',
        investigative: '#4ECDC4',
        artistic: '#45B7D1',
        social: '#96CEB4',
        enterprising: '#FFEAA7',
        conventional: '#DDA0DD',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
