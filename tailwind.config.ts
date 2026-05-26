import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0a0a0a',
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#c8c8c8',
          300: '#a0a0a0',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
        accent: {
          DEFAULT: '#81B0E6',
          light: '#a8c8ee',
          dark: '#5a8fc8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#262626',
            a: { color: '#5a8fc8' },
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
