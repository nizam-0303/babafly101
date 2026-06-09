/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#F0F4FF',
          100: '#E0E8FF',
          600: '#3D4E6B',
          700: '#2D3B55',
          800: '#1E293B',
          900: '#0F172A',
          950: '#080E1A',
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(15,23,42,0.08)',
        'card-lg': '0 8px 40px rgba(15,23,42,0.12)',
        'card-xl': '0 16px 64px rgba(15,23,42,0.16)',
        'glow-blue': '0 0 24px rgba(59,130,246,0.4)',
      },
    },
  },
  plugins: [],
};
