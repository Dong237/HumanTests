/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 16PF Factor Colors - professional, varied palette
        'factor-a': '#3B82F6',  // blue - 乐群性 Warmth
        'factor-b': '#8B5CF6',  // violet - 聪慧性 Reasoning
        'factor-c': '#10B981',  // emerald - 稳定性 Emotional Stability
        'factor-e': '#F59E0B',  // amber - 恃强性 Dominance
        'factor-f': '#EC4899',  // pink - 兴奋性 Liveliness
        'factor-g': '#6366F1',  // indigo - 有恒性 Rule-Consciousness
        'factor-h': '#EF4444',  // red - 敢为性 Social Boldness
        'factor-i': '#14B8A6',  // teal - 敏感性 Sensitivity
        'factor-l': '#F97316',  // orange - 怀疑性 Vigilance
        'factor-m': '#A855F7',  // purple - 幻想性 Abstractedness
        'factor-n': '#06B6D4',  // cyan - 世故性 Privateness
        'factor-o': '#84CC16',  // lime - 忧虑性 Apprehension
        'factor-q1': '#22D3EE', // sky - 实验性 Openness to Change
        'factor-q2': '#FB923C', // orange-400 - 独立性 Self-Reliance
        'factor-q3': '#34D399', // emerald-400 - 自律性 Perfectionism
        'factor-q4': '#F472B6', // pink-400 - 紧张性 Tension
        'cattell-primary': '#6366F1',
        'cattell-secondary': '#3B82F6',
        'cattell-accent': '#8B5CF6',
      },
      fontFamily: {
        'hand': ['"Comic Sans MS"', '"Comic Sans"', 'cursive'],
      },
    },
  },
  plugins: [],
}
