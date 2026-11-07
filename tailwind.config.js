/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: { navy: '#101D35', 50: '#EEF0FF', 500: '#5965E9', 600: '#4C57D6', 700: '#424DBF' },
        emerald: '#16A36A',
        ink: '#18243A',
        muted: '#788397',
        canvas: '#F6F7FB',
        border: '#E9ECF2',
        warning: '#E9A23B',
      },
      borderRadius: { card: '16px' },
      boxShadow: { card: '0 8px 26px rgba(20, 32, 58, 0.045)' },
    },
  },
  plugins: [],
}
