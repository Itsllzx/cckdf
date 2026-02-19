import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#00F5D4'
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.25)'
      },
      backdropBlur: {
        glass: '20px'
      },
      borderRadius: {
        glass: '20px'
      }
    }
  },
  plugins: []
} satisfies Config;
