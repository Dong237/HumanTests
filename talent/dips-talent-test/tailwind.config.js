/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        linguistic: '#FF6B6B',
        logical: '#4ECDC4',
        spatial: '#45B7D1',
        intrapersonal: '#96CEB4',
        interpersonal: '#FFEAA7',
        kinesthetic: '#DDA0DD',
        musical: '#FF8C94',
        naturalist: '#7FB069',
        creative: '#F39C12',
        aesthetic: '#E056A0',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
