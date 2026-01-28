/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neuroticism: '#FFB3BA',
        extraversion: '#FFDFBA',
        openness: '#BAE1FF',
        agreeableness: '#BAFFC9',
        conscientiousness: '#D4BAFF',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
