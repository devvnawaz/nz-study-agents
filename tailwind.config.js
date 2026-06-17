/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef9ff',
          100: '#d9f1ff',
          200: '#bce7ff',
          300: '#8ed8ff',
          400: '#59c0ff',
          500: '#32a6fc',
          600: '#1a88f1',
          700: '#1270de',
          800: '#155ab3',
          900: '#174d8d',
          950: '#122f55',
        },
        nz: {
          black: '#00247d',
          red:   '#cc142b',
        },
      },
    },
  },
  plugins: [],
};
