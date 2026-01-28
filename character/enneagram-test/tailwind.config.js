/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'type-1': '#8B4513', // saddle brown - 改革者
        'type-2': '#CD853F', // peru - 助人者
        'type-3': '#D2691E', // chocolate - 成就者
        'type-4': '#B8860B', // dark goldenrod - 艺术家
        'type-5': '#A0522D', // sienna - 观察者
        'type-6': '#DAA520', // goldenrod - 忠诚者
        'type-7': '#F4A460', // sandy brown - 热情者
        'type-8': '#8B4726', // dark brown - 挑战者
        'type-9': '#D2B48C', // tan - 和平者
        'terracotta': '#E07A5F',
        'rust': '#C44536',
        'clay': '#A67B5B',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
