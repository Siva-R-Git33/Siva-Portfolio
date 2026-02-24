import { useEffect } from 'react';
import { settingsAPI } from '../utils/api';

export const THEMES = [
    {
        id: 'cyber-green',
        name: 'Cyber Green',
        primary: '#00ff41',
        accent: '#00d4ff',
        highlight: '#bd00ff',
        bg: '#0a0a0f',
        preview: ['#00ff41', '#00d4ff', '#bd00ff'],
    },
    {
        id: 'electric-blue',
        name: 'Electric Blue',
        primary: '#00d4ff',
        accent: '#00ff41',
        highlight: '#ff0040',
        bg: '#0a0f14',
        preview: ['#00d4ff', '#00ff41', '#ff0040'],
    },
    {
        id: 'violet-storm',
        name: 'Violet Storm',
        primary: '#bd00ff',
        accent: '#00d4ff',
        highlight: '#00ff41',
        bg: '#0d0a14',
        preview: ['#bd00ff', '#00d4ff', '#00ff41'],
    },
    {
        id: 'crimson-red',
        name: 'Crimson Red',
        primary: '#ff0040',
        accent: '#ff8800',
        highlight: '#ffdd00',
        bg: '#140a0a',
        preview: ['#ff0040', '#ff8800', '#ffdd00'],
    },
    {
        id: 'solar-orange',
        name: 'Solar Orange',
        primary: '#ff8800',
        accent: '#ffdd00',
        highlight: '#00ff41',
        bg: '#140e05',
        preview: ['#ff8800', '#ffdd00', '#00ff41'],
    },
    {
        id: 'aqua-marine',
        name: 'Aqua Marine',
        primary: '#00ffcc',
        accent: '#00a8ff',
        highlight: '#ff00aa',
        bg: '#051410',
        preview: ['#00ffcc', '#00a8ff', '#ff00aa'],
    },
];

export const DEFAULT_THEME = {
    themeId: 'cyber-green',
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    fontFamily: 'Inter',
    fontSize: 'base',
};

export function applyTheme(settings) {
    const theme = THEMES.find((t) => t.id === settings.themeId) || THEMES[0];
    const root = document.documentElement;

    // Apply color CSS variables
    root.style.setProperty('--neon-green', theme.primary);
    root.style.setProperty('--neon-blue', theme.accent);
    root.style.setProperty('--neon-purple', theme.highlight);
    root.style.setProperty('--scrollbar-color', theme.primary);

    // Apply font
    const fontMap = {
        'Inter': "'Inter', system-ui, sans-serif",
        'JetBrains Mono': "'JetBrains Mono', monospace",
        'Roboto': "'Roboto', system-ui, sans-serif",
        'Poppins': "'Poppins', system-ui, sans-serif",
        'System': "system-ui, sans-serif",
    };
    root.style.setProperty('--site-font', fontMap[settings.fontFamily] || fontMap['Inter']);
    document.body.style.fontFamily = fontMap[settings.fontFamily] || fontMap['Inter'];

    // Apply font size
    const sizeMap = { small: '14px', base: '16px', large: '18px' };
    root.style.fontSize = sizeMap[settings.fontSize] || '16px';

    // Apply CSS filter (brightness / contrast / saturation)
    const filter = `brightness(${settings.brightness}) contrast(${settings.contrast}) saturate(${settings.saturation})`;
    // Apply only to the site wrapper, not admin
    const siteWrapper = document.getElementById('site-wrapper');
    if (siteWrapper) siteWrapper.style.filter = filter;
}

export default function useTheme() {
    useEffect(() => {
        settingsAPI.get('siteTheme')
            .then((r) => {
                const settings = r.data ? { ...DEFAULT_THEME, ...r.data } : DEFAULT_THEME;
                applyTheme(settings);
            })
            .catch(() => applyTheme(DEFAULT_THEME));
    }, []);
}
