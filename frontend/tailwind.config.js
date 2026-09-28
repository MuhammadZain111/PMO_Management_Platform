/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0a2f3a',
        'primary-container': '#0f4c5c',
        'on-primary': '#ffffff',
        'on-primary-container': '#8ad9ee',
        secondary: '#555f6d',
        background: '#f7f9fa',
        surface: '#f7f9fa',
        'surface-bright': '#f7f9fa',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f5f6',
        'surface-container': '#edeeef',
        'surface-container-high': '#e6ebec',
        'surface-container-highest': '#e1e6e7',
        'surface-variant': '#e1e3e4',
        'on-surface': '#191c1d',
        'on-surface-variant': '#41484a',
        outline: '#6f8b90',
        error: '#ba1a1a'
      },
      spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px' },
      borderRadius: { DEFAULT: '0.25rem', lg: '0.5rem', xl: '0.75rem' }
    }
  },
  plugins: []
};
