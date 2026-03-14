import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        gold: {
          400: '#f0c675',
          500: '#d4a853',
          600: '#b8902f',
        },
        warm: {
          50: '#fafaf9',
          100: '#f5f5f4',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
