/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 6 Virtue Colors
        wisdom: '#6366F1',         // Indigo
        courage: '#EF4444',        // Red
        humanity: '#EC4899',       // Pink
        justice: '#3B82F6',        // Blue
        temperance: '#14B8A6',     // Teal
        transcendence: '#A855F7',  // Purple

        // 24 Character Strengths (4 per virtue)
        // Wisdom strengths
        creativity: '#8B5CF6',
        curiosity: '#06B6D4',
        judgement: '#10B981',
        loveOfLearning: '#F59E0B',
        perspective: '#6366F1',

        // Courage strengths
        bravery: '#DC2626',
        perseverance: '#F97316',
        honesty: '#84CC16',
        zest: '#FBBF24',

        // Humanity strengths
        love: '#F43F5E',
        kindness: '#FB7185',
        socialIntelligence: '#EC4899',

        // Justice strengths
        teamwork: '#0EA5E9',
        fairness: '#3B82F6',
        leadership: '#6366F1',

        // Temperance strengths
        forgiveness: '#14B8A6',
        humility: '#06B6D4',
        prudence: '#059669',
        selfRegulation: '#10B981',

        // Transcendence strengths
        appreciation: '#D946EF',
        gratitude: '#C026D3',
        hope: '#A855F7',
        humor: '#9333EA',
        spirituality: '#7C3AED',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
