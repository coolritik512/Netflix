/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        dark:'hsl(0deg 0% 8%)',
        netflixRed: '#e50a14',
        errorBackground:'#e87c03',
      },
      animation:{
        'slide-rtl':"slide-rtl .8s ease-in-out"
      },
      keyframes:{
        'slide-rtl':{
          from:{'margin-right':'-100%'},
          to :{'margin-right':'0%'}
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}