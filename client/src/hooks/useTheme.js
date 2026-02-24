import { useEffect } from 'react';
import { settingsAPI } from '../utils/api';

// Each theme is defined by a hue-rotate offset from the default green palette.
// hue-rotate(Xdeg) changes ALL rendered colors uniformly — works with Tailwind.
export const THEMES = [
    { id: 'cyber-green', name: 'Cyber Green', hue: 0, preview: ['#00ff41', '#00d4ff', '#bd00ff'] },
    { id: 'electric-blue', name: 'Electric Blue', hue: 80, preview: ['#00e5ff', '#00ff99', '#ff3399'] },
    { id: 'violet-storm', name: 'Violet Storm', hue: 160, preview: ['#cc00ff', '#00ccdd', '#00ff41'] },
    { id: 'crimson-red', name: 'Crimson Red', hue: 220, preview: ['#ff2200', '#ff8800', '#ffcc00'] },
    { id: 'solar-orange', name: 'Solar Orange', hue: 280, preview: ['#ff8800', '#ffdd00', '#88ff00'] },
    { id: 'aqua-marine', name: 'Aqua Marine', hue: 40, preview: ['#00ffcc', '#00a8ff', '#ff00aa'] },
];

export const DEFAULT_THEME = {
    themeId: 'cyber-green',
    hue: 0,
    brightness: 1.0,
    contrast: 1.0,
    saturation: 1.0,
    fontFamily: 'Inter',
    fontSize: 'base',
};

const FONT_MAP = {
    'Inter': "'Inter', system-ui, sans-serif",
    'JetBrains Mono': "'JetBrains Mono', monospace",
    'Roboto': "'Roboto', system-ui, sans-serif",
    'Poppins': "'Poppins', system-ui, sans-serif",
    'System': "system-ui, sans-serif",
};

const SIZE_MAP = { small: '14px', base: '16px', large: '18px' };

export function applyTheme(settings) {
    const s = { ...DEFAULT_THEME, ...settings };
    const theme = THEMES.find((t) => t.id === s.themeId) || THEMES[0];
    const hue = theme.hue;

    // Apply CSS filter to the html element — affects ALL colors on the page
    // including every Tailwind class, regardless of hardcoded hex values.
    document.documentElement.style.filter =
        `hue-rotate(${hue}deg) brightness(${s.brightness}) contrast(${s.contrast}) saturate(${s.saturation})`;

    // Font family
    document.body.style.fontFamily = FONT_MAP[s.fontFamily] || FONT_MAP['Inter'];

    // Font size
    document.documentElement.style.fontSize = SIZE_MAP[s.fontSize] || '16px';
}

export default function useTheme() {
    useEffect(() => {
        settingsAPI.get('siteTheme')
            .then((r) => {
                applyTheme(r.data ? { ...DEFAULT_THEME, ...r.data } : DEFAULT_THEME);
            })
            .catch(() => applyTheme(DEFAULT_THEME));
    }, []);
}
