/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#f5efe6',
        'cream-soft': '#faf6ef',
        ink: '#1a1a1a',
        'ink-soft': '#4b4b4b',
        muted: '#8a8478',
        brand: {
          DEFAULT: '#f59222',
          50: '#fff1e0',
          100: '#ffe0bd',
          200: '#ffcd91',
          300: '#ffb663',
          400: '#fba33f',
          500: '#f59222',
          600: '#e07a10',
          700: '#b85f08',
          800: '#8a4807',
          900: '#5e3206'
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
        info: '#0ea5e9'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        soft: '0 4px 24px rgba(16,24,40,0.06)'
      }
    }
  },
  plugins: []
}
