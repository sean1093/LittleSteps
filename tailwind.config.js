/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The rendered palette. `primary`/`secondary` previously declared
        // #F472B6/#60A5FA while ~195 hardcoded pastel hexes rendered on top of
        // them, so a page showed a hot-pink header above soft-coral content.
        // The pastels won on usage and on warmth, so they became the tokens.
        //
        // DEFAULT shades sit at ~2:1 against white: they are fills, tints and
        // ornament, never text and never a bed for white text. Anything that
        // carries text uses `dark` (>=4.5:1) — see the ramp comments.
        primary: {
          DEFAULT: '#FF9B9B', // soft coral — fills, progress bars, active chips
          light: '#FFE5E5',   // tint background
          soft: '#FFF4F4',    // faintest wash
          dark: '#B84A50',    // 5.08:1 on white — text, and white text on it
        },
        secondary: {
          DEFAULT: '#7EC8E3', // soft sky
          light: '#E8F4F8',
          soft: '#F5FAFC',
          dark: '#2F7F9C',    // 4.53:1 on white
        },
        mint: {
          DEFAULT: '#81C784', // vaccines, "safe"/"done" states
          light: '#E8F5E9',
          soft: '#F4FAF5',
          dark: '#3F7D43',    // 4.97:1 on white
        },
        butter: {
          DEFAULT: '#F0B357', // food, nappies, gentle warnings
          light: '#FFF3E0',
          soft: '#FFFAF2',
          dark: '#9A6212',    // 5.08:1 on white
        },
        warm: {
          // One page background. `#FAFAF9` and `#FDFBF7` were both in use for
          // the same role; the warmer one won.
          white: '#FDFBF7',
          cream: '#FEF3C7',
        },
        // Body copy. Pure `gray-*` reads cold against the warm background.
        ink: {
          DEFAULT: '#3F3A38', // 10.8:1 on warm.white
          muted: '#6B6360',   // 5.4:1  — secondary copy
          faint: '#938A86',   // 3.2:1  — captions, never body text
        },
        // LittleBloom Morandi palette.
        //
        // The Morandi shades are deliberately desaturated, which makes them
        // beautiful as fills and unusable as text: `dusty-rose` is 2.16:1 on
        // white and `stone` — which was the module's heading colour — is
        // 1.80:1. Every `-ink` shade below is the readable partner (>=4.5:1)
        // for the fill of the same name. Fills tint, inks speak.
        bloom: {
          // Primary colors
          'dusty-rose': '#D4A5A5',
          'dusty-rose-light': '#E6C9C9',
          'dusty-rose-dark': '#B88A8A',
          'dusty-rose-ink': '#8E6A6A',   // 4.75:1
          'dusty-rose-deep': '#966565',  // 4.83:1 — bed for white text
          'blush': '#F3E4E4',            // was referenced but never defined
          'sage': '#A8B5A0',
          'sage-light': '#C4CFC0',
          'sage-dark': '#8A9985',
          'sage-ink': '#5F6B5B',         // 5.61:1
          // Secondary colors
          'mauve': '#B8A8C8',
          'mauve-light': '#D5C9DF',
          'mauve-dark': '#9A8AAD',
          'mauve-ink': '#6E5F80',        // 5.81:1
          'terracotta': '#D4A59A',
          'terracotta-light': '#E6C9BF',
          'terracotta-dark': '#B88A7E',
          'terracotta-ink': '#8C5F52',   // 5.42:1
          // Neutral colors
          'cream': '#F5F0E8',
          'sand': '#E8DFD3',
          'stone': '#C9C0B5',
          'stone-ink': '#6E655C',        // 5.71:1 — headings and body copy
          // Accent
          'dusty-blue': '#A8B8C8',
          'dusty-blue-light': '#C4D0DD',
          'dusty-blue-dark': '#8A9AAD',
          'dusty-blue-ink': '#5C6B7D',   // 5.45:1
        },
        // LittleExplorer（幼兒期）palette. Same rule: `bark` already reads at
        // 6.5:1 so it stays the body colour; the bright accents get inks.
        explorer: {
          'sunbeam': '#F5B843',
          'sunbeam-light': '#FBE0A6',
          'sunbeam-dark': '#D99A22',
          'sunbeam-ink': '#8A5E0F',      // 5.69:1
          'meadow': '#7FB77E',
          'meadow-light': '#B7D9B6',
          'meadow-dark': '#5C9159',
          'meadow-ink': '#3F6B3D',       // readable partner
          'sky': '#6FB3D2',
          'sky-light': '#B3D8E8',
          'sky-ink': '#2F7B9B',          // 4.74:1
          'clay': '#E08D6F',
          'clay-ink': '#A2523A',         // 5.52:1
          'sand': '#FDF8EE',
          'bark': '#6B5B4E',             // 6.50:1
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        // Two elevations, on purpose. Surfaces used `shadow-soft`, `soft-lg`,
        // `lg`, `xl` and `2xl` interchangeably for the same card role; the
        // heavier Tailwind defaults are what made cards look stuck-on rather
        // than resting on the page.
        'soft': '0 2px 15px -3px rgba(63, 58, 56, 0.07), 0 10px 20px -2px rgba(63, 58, 56, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(63, 58, 56, 0.12)',
      },
      spacing: {
        // Minimum comfortable touch target. Icon-only buttons were shipping at
        // 28-40px; this gives them one name to reach for.
        tap: '2.75rem', // 44px
      },
      keyframes: {
        // Indeterminate progress: a bar sweeping its track. Replaces the
        // pulsing icons that used to stand in for "loading".
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
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
