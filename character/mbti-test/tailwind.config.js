/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mbti-purple': '#9333EA',
        'mbti-indigo': '#6366F1',
        'mbti-violet': '#8B5CF6',
        'mbti-light': '#C4B5FD',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
