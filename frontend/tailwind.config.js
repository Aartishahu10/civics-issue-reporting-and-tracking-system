/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0f766e',
        accent: '#2563eb',
        sky: '#e0f2fe',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 118, 110, 0.12)',
      },
    },
  },
  plugins: [],
}
