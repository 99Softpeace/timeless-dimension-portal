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
        midnight: '#0B1020',
        'midnight-2': '#121827',
        'midnight-3': '#1A2332',
        teal: '#00E5C4',
        'teal-dark': '#00BFA5',
        gold: '#D4AF37',
        'gold-light': '#F4D03F',
        silver: '#E6EEF6',
        'silver-dark': '#B8C6D6',
        'nigerian-green': '#008751',
        'nigerian-white': '#FFFFFF',
        'nigerian-red': '#E31E24',
        glass: 'rgba(255, 255, 255, 0.04)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Poppins', 'Inter'],
        nigerian: ['Noto Sans Adlam', 'Inter'],
      },
      backgroundImage: {
        'midnight-gradient': 'linear-gradient(180deg, #0B1020 0%, #121827 100%)',
        'nigerian-gradient': 'linear-gradient(135deg, #008751 0%, #00E5C4 100%)',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glow: '0 0 10px rgba(0,229,196,0.35), 0 0 20px rgba(0,229,196,0.25)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #00E5C4' },
          '100%': { boxShadow: '0 0 20px #00E5C4, 0 0 30px #00E5C4' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
