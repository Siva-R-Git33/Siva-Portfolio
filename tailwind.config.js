/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './client/src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'cyber-black': '#0a0a0f',
                'cyber-dark': '#0d1117',
                'cyber-gray': '#161b22',
                'cyber-border': '#21262d',
                'neon-green': 'var(--neon-green)',
                'neon-green-dim': 'var(--neon-green-dim)',
                'neon-blue': 'var(--neon-blue)',
                'neon-blue-dim': 'var(--neon-blue-dim)',
                'neon-purple': 'var(--neon-purple)',
                'neon-red': 'var(--neon-red)',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'neon-green': '0 0 5px var(--neon-green), 0 0 20px rgba(0, 255, 65, 0.3)',
                'neon-blue': '0 0 5px var(--neon-blue), 0 0 20px rgba(0, 212, 255, 0.3)',
                'neon-purple': '0 0 5px var(--neon-purple), 0 0 20px rgba(189, 0, 255, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            animation: {
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'matrix-rain': 'matrixRain 10s linear infinite',
                'typing': 'typing 3.5s steps(40, end)',
                'blink-caret': 'blinkCaret .75s step-end infinite',
                'scan-line': 'scanLine 8s linear infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 5px #00ff41, 0 0 20px rgba(0, 255, 65, 0.3)' },
                    '50%': { boxShadow: '0 0 20px #00ff41, 0 0 60px rgba(0, 255, 65, 0.5)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                typing: {
                    'from': { width: '0' },
                    'to': { width: '100%' },
                },
                blinkCaret: {
                    'from, to': { borderColor: 'transparent' },
                    '50%': { borderColor: '#00ff41' },
                },
                scanLine: {
                    '0%': { top: '-100%' },
                    '100%': { top: '100%' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
