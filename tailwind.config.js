/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          ligth:'#9f9',
          DEFAULT:'#0f0',
          dark:'#060',
        },
        secondary: {
          light: '#333',
          DEFAULT: '#222',
          dark: '#000',
        },
        accent: '#f82',    
        background: '#aaa',
        error: '#f55',
      },
      boxShadow: {
        'custom-2xl': '0px 0px 50px rgba(0, 0, 0, 9',
        'custom-xl': '0px 0px 10px rgba(40, 40, 40, 2)'
      },
      animation:{
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
    keyframes: {
      wiggle: {
        '0%, 100%': { transform: 'rotate(-15deg)' },
        '50%': { transform: 'rotate(15deg)' },
      },
    }
    },
  },
  plugins: [],
}


