const svgToDataUri = require('mini-svg-data-uri');
const {
  default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'src/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-conic':
          'conic-gradient(var(--conic-position), var(--tw-gradient-stops))',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'animate-gradient-1': {
          '0%, 16.667%, 100%': { opacity: '1' },
          '33.333%, 83.333%': { opacity: '0' },
        },
        'animate-gradient-2': {
          '0%, 16.667%, 66.667%, 100%': { opacity: '0' },
          '33.333%, 50%': { opacity: '1' },
        },
        'animate-gradient-3': {
          '0%, 50%,  100%': { opacity: '0' },
          '66.667%, 83.333%': { opacity: '1' },
        },
        'animate-gradient-4': {
          '0%, 33.333%, 66.667%, 100%': { opacity: '0' },
          '50%, 83.333%': { opacity: '1' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-1': 'animate-gradient-1 8s infinite',
        'gradient-2': 'animate-gradient-2 8s infinite',
        'gradient-3': 'animate-gradient-3 8s infinite',
        'gradient-4': 'animate-gradient-4 8s infinite',
        blob: 'blob 7s infinite',
        'bg-grid-fade': {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
      },
    },
  },
  daisyui: {
    themes: [],
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-grid': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg stroke="${value}" width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none" className="bi bi-dot">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>`
            )}")`,
          }),
        },
        {
          values: flattenColorPalette(theme('backgroundColor')),
          type: 'color',
        }
      );
    },
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    require('tw-elements/dist/plugin'),
  ],
};
