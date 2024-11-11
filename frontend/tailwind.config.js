/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rockBlack: '#1a1a1a',
        rockRed: '#e63946',
        rockYellow: '#f4a261',
        rockGray: '#333333',
      },
      fontFamily: {
        rock: ['"Roboto Slab"', 'serif'],
      },
    },
  },
  plugins: [],
};
