/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dominance: '#FF6B6B',
        influence: '#FFEAA7',
        steadiness: '#96CEB4',
        conscientiousness: '#4ECDC4',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
