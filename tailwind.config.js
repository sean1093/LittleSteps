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
          DEFAULT: '#F472B6',
          light: '#FBCFE8',
          dark: '#EC4899',
        },
        secondary: {
          DEFAULT: '#60A5FA',
          light: '#DBEAFE',
          dark: '#3B82F6',
        },
        warm: {
          white: '#FAFAF9',
          cream: '#FEF3C7',
        },
        // LittleBloom Morandi Color Palette
        bloom: {
          // Primary colors
          'dusty-rose': '#D4A5A5',
          'dusty-rose-light': '#E6C9C9',
          'dusty-rose-dark': '#B88A8A',
          'sage': '#A8B5A0',
          'sage-light': '#C4CFC0',
          'sage-dark': '#8A9985',
          // Secondary colors
          'mauve': '#B8A8C8',
          'mauve-light': '#D5C9DF',
          'mauve-dark': '#9A8AAD',
          'terracotta': '#D4A59A',
          'terracotta-light': '#E6C9BF',
          'terracotta-dark': '#B88A7E',
          // Neutral colors
          'cream': '#F5F0E8',
          'sand': '#E8DFD3',
          'stone': '#C9C0B5',
          // Accent
          'dusty-blue': '#A8B8C8',
          'dusty-blue-light': '#C4D0DD',
          'dusty-blue-dark': '#8A9AAD',
        },
        // LittleExplorer（幼兒期）Palette
        explorer: {
          'sunbeam': '#F5B843',
          'sunbeam-light': '#FBE0A6',
          'sunbeam-dark': '#D99A22',
          'meadow': '#7FB77E',
          'meadow-light': '#B7D9B6',
          'meadow-dark': '#5C9159',
          'sky': '#6FB3D2',
          'sky-light': '#B3D8E8',
          'clay': '#E08D6F',
          'sand': '#FDF8EE',
          'bark': '#6B5B4E',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang TC',
          'Microsoft JhengHei',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
