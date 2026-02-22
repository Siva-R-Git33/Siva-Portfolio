/** @type {import('tailwindcss').Config} */
export default {
    content: ['./client/index.html', './client/src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'cyber-black': '#0a0a0f',
                'cyber-dark': '#0d1117',
                'cyber-gray': '#161b22',
                'cyber-border': '#21262d',
                'neon-green': '#00ff41',
                'neon-green-dim': '#00cc33',
                'neon-blue': '#00d4ff',
                'neon-blue-dim': '#0099cc',
                'neon-purple': '#bd00ff',
                'neon-red': '#ff0040',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'neon-green': '0 0 5px #00ff41, 0 0 20px rgba(0, 255, 65, 0.3)',
                'neon-blue': '0 0 5px #00d4ff, 0 0 20px rgba(0, 212, 255, 0.3)',
                'neon-purple': '0 0 5px #bd00ff, 0 0 20px rgba(189, 0, 255, 0.3)',
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
