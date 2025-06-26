/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a1a', // Dark theme background
          light: '#2a2a2a',
        },
        accent: {
          DEFAULT: '#8B0000', // Darker red for "Hi"
          light: '#ff4040',
        },
      },
    },
  },
  plugins: [],
}

