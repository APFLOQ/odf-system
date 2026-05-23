/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#000000',
        surface: {
          DEFAULT: '#0a0a0f',
          raised: '#111118',
          overlay: '#18181f',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.03)',
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          hover: 'rgba(139, 92, 246, 0.35)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          tertiary: '#71717a',
          muted: '#52525b',
        },
        violet: {
          DEFAULT: '#8052ff',
          dim: 'rgba(128, 82, 255, 0.12)',
          glow: 'rgba(128, 82, 255, 0.3)',
        },
        teal: {
          DEFAULT: '#15846e',
          dim: 'rgba(21, 132, 110, 0.12)',
        },
        yellow: {
          DEFAULT: '#ffb829',
          dim: 'rgba(255, 184, 41, 0.12)',
        },
        cyan: {
          DEFAULT: '#06b6d4',
          dim: 'rgba(6, 182, 212, 0.12)',
        },
        pink: {
          DEFAULT: '#ec4899',
          dim: 'rgba(236, 72, 153, 0.12)',
        },
        discord: {
          DEFAULT: '#5865F2',
          hover: '#4752C4',
        },
        /* Monopo Saigon */
        canvas: '#000000',
        'frost-white': '#ffffff',
        'deep-shadow': '#181818',
        'whisper-gray': '#6d6d6d',
        'misty-gray': '#636363',
        'ocean-green': '#a0e0ab',
      },
      fontFamily: {
        sans: ['Roobert', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        roobert: ['Roobert', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'caption': ['11px', { lineHeight: '1.58' }],
        'body': ['16px', { lineHeight: '1.25' }],
        'subheading': ['18px', { lineHeight: '1.22' }],
        'heading-sm': ['29px', { lineHeight: '1.21' }],
        'heading': ['39px', { lineHeight: '1.15' }],
        'heading-lg': ['54px', { lineHeight: '1.39' }],
        'display': ['225px', { lineHeight: '0.7' }],
      },
      borderRadius: {
        'cards': '10px',
        'buttons': '75.024px',
        'full': '75.024px',
        '2xs': '4px',
        'xs': '6px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      spacing: {
        '8': '8px',
        '12': '12px',
        '28': '28px',
        '40': '40px',
        '48': '48px',
        '64': '64px',
        '68': '68px',
        '152': '152px',
      },
      maxWidth: {
        'page': '1078px',
      },
      boxShadow: {
        'glow-violet': '0 0 30px rgba(128, 82, 255, 0.25)',
        'glow-teal': '0 0 30px rgba(21, 132, 110, 0.25)',
        'glow-yellow': '0 0 30px rgba(255, 184, 41, 0.25)',
        'card': '0 0 40px rgba(128, 82, 255, 0.06)',
        'card-hover': '0 0 40px rgba(128, 82, 255, 0.12), 0 20px 50px rgba(0,0,0,0.5)',
        'navbar': '0 8px 32px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'gradient-flow': 'gradient-flow 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 40s linear infinite',
        'spin-reverse': 'spin-reverse 60s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'counter-up': 'counter-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}