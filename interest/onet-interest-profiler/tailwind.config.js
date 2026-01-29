/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        realistic: '#8B4513',
        investigative: '#4169E1',
        artistic: '#9370DB',
        social: '#20B2AA',
        enterprising: '#FF8C00',
        conventional: '#4682B4',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
