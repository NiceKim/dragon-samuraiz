/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        blood : {
          50: '#b50000',
          100: '#930000',
        }
      },
      keyframes: {
        winCard: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
      },
      animation: {
        'win-card': 'winCard 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} 