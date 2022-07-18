/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsla(236, 18%, 19%, 1)',
        brand: 'hsla(138, 25%, 56%, 1)',
        accent: 'hsla(238, 14%, 53%, 1)',
        text: 'hsla(240, 25%, 98%, 1)',
        tableAccent: 'hsla(240, 17%, 16%, 1)',
        backgroundAccent: 'hsla(236, 18%, 9%, 1)',
        gitHubGreen: 'hsla(128, 49%, 49%, 1)',
        gitHubRed: 'hsla(3, 93%, 63%, 1)',
      },
      fontFamily: {
        heading: ['Nunito', 'sans-serif'],
        body: ['"PT Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
