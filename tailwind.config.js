/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'sans-serif'],
      },
      animation: {
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'fade-out': 'fadeOut 0.5s ease-out forwards',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeOut: {
          'from': { opacity: '1' },
          'to': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
