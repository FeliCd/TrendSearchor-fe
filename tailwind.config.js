/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0058be',
          50:  '#e6f0ff',
          100: '#cce0ff',
          200: '#99c1ff',
          300: '#66a2ff',
          400: '#3383ff',
          500: '#0064f5',
          600: '#0058be',
          700: '#004faf',
          800: '#003d87',
          900: '#002b60',
        },
        secondary: {
          DEFAULT: '#0058be',
          container: '#2170e4',
        },
        tertiary: {
          DEFAULT: '#009668',
          container: '#002113',
        },
        surface: {
          lowest:    '#ffffff',
          low:       '#eff4ff',
          DEFAULT:   '#f8f9ff',
          container: '#e5eeff',
          high:      '#dce9ff',
          highest:   '#d3e4fe',
          dim:       '#cbdbf5',
        },
        'on-surface': {
          DEFAULT: '#0b1c30',
          variant: '#45464d',
        },
        background: {
          DEFAULT: '#f8f9ff',
        },
        outline: {
          DEFAULT: '#76777d',
          variant: '#c6c6cd',
        },
        inverse: {
          surface: '#213145',
          'on-surface': '#eaf1ff',
          primary: '#bec6e0',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': {
          DEFAULT: '#ffffff',
          container: '#93000a',
        },
      },
      fontFamily: {
        sans: ['"M PLUS U"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm:  '0.125rem',
        DEFAULT: '0.25rem',
        md:  '0.375rem',
        lg:  '0.5rem',
        xl:  '0.75rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
