import { useEffect, useState } from 'react';
import { settingsAPI } from '../utils/api';
import { THEMES, DEFAULT_THEME, applyTheme } from '../hooks/useTheme';

const FONTS = ['Inter', 'JetBrains Mono', 'Roboto', 'Poppins', 'System'];

function Slider({ label, value, min, max, step, onChange }) {
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-gray-400 text-sm font-mono">{label}</label>
                <span className="text-neon-green font-mono text-sm">{(value * 100).toFixed(0)}%</span>
            </div>
            <input
                type="range"
                min={min} max={max} step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full accent-neon-green"
                style={{ accentColor: 'var(--neon-green, #00ff41)' }}
            />
            <div className="flex justify-between text-gray-600 text-xs font-mono mt-0.5">
                <span>{(min * 100).toFixed(0)}%</span>
                <span>{(max * 100).toFixed(0)}%</span>
            </div>
        </div>
    );
}

export default function ManageTheme() {
    const [settings, setSettings] = useState(DEFAULT_THEME);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        settingsAPI.get('siteTheme').then((r) => {
            if (r.data) setSettings({ ...DEFAULT_THEME, ...r.data });
        }).catch(() => { });
    }, []);

    const update = (patch) => {
        const next = { ...settings, ...patch };
        // If switching theme preset, also store its hue
        if (patch.themeId) {
            const t = THEMES.find((t) => t.id === patch.themeId);
            if (t) next.hue = t.hue;
        }
        setSettings(next);
        applyTheme(next); // live preview — applies filter to document.documentElement
    };

    const save = async () => {
        setSaving(true);
        try {
            await settingsAPI.set('siteTheme', settings);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            alert('Failed to save theme settings.');
        } finally {
            setSaving(false);
        }
    };

    const reset = () => {
        update(DEFAULT_THEME);
    };

    const currentTheme = THEMES.find((t) => t.id === settings.themeId) || THEMES[0];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Theme Customization</h1>
                    <p className="text-gray-400 text-sm mt-1">Changes apply live as you adjust. Save to persist.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-cyber-border hover:border-neon-green/50 hover:text-white transition-all"
                    >
                        Reset Default
                    </button>
                    <button
                        onClick={save}
                        disabled={saving}
                        className="cyber-btn-solid text-sm"
                    >
                        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Theme'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Color Themes */}
                <div className="cyber-card">
                    <h2 className="text-lg font-bold text-white mb-1">Color Theme</h2>
                    <p className="text-gray-500 text-xs font-mono mb-4">Select a preset color scheme for your portfolio</p>
                    <div className="grid grid-cols-2 gap-3">
                        {THEMES.map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => update({ themeId: theme.id })}
                                style={{
                                    border: settings.themeId === theme.id
                                        ? `2px solid ${theme.preview[0]}`
                                        : '2px solid #21262d',
                                    boxShadow: settings.themeId === theme.id
                                        ? `0 0 12px ${theme.preview[0]}55`
                                        : 'none',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    background: '#161b22',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                }}
                            >
                                <div className="flex gap-1.5 mb-2">
                                    {theme.preview.map((c) => (
                                        <div
                                            key={c}
                                            style={{
                                                width: 14,
                                                height: 14,
                                                borderRadius: '50%',
                                                backgroundColor: c,
                                                boxShadow: `0 0 6px ${c}88`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div style={{ color: settings.themeId === theme.id ? theme.preview[0] : '#9ca3af', fontSize: '13px', fontWeight: 600 }}>
                                    {theme.name}
                                </div>
                                {settings.themeId === theme.id && (
                                    <div style={{ color: theme.preview[0], fontSize: '10px', marginTop: '2px', fontFamily: 'monospace' }}>
                                        ● Active
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Adjustments */}
                <div className="space-y-1">
                    <div className="cyber-card">
                        <h2 className="text-lg font-bold text-white mb-4">Visual Adjustments</h2>
                        <Slider
                            label="Brightness"
                            value={settings.brightness}
                            min={0.5} max={1.5} step={0.05}
                            onChange={(v) => update({ brightness: v })}
                        />
                        <Slider
                            label="Contrast"
                            value={settings.contrast}
                            min={0.5} max={1.5} step={0.05}
                            onChange={(v) => update({ contrast: v })}
                        />
                        <Slider
                            label="Saturation"
                            value={settings.saturation}
                            min={0.2} max={2.0} step={0.05}
                            onChange={(v) => update({ saturation: v })}
                        />
                    </div>

                    <div className="cyber-card mt-4">
                        <h2 className="text-lg font-bold text-white mb-4">Typography</h2>
                        <div className="mb-4">
                            <label className="block text-gray-400 text-sm font-mono mb-2">Font Family</label>
                            <div className="grid grid-cols-1 gap-2">
                                {FONTS.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => update({ fontFamily: f })}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            border: settings.fontFamily === f
                                                ? `1px solid ${currentTheme.preview[0]}`
                                                : '1px solid #21262d',
                                            background: settings.fontFamily === f ? `${currentTheme.preview[0]}15` : '#161b22',
                                            color: settings.fontFamily === f ? currentTheme.preview[0] : '#9ca3af',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontFamily: f === 'System' ? 'system-ui' : `'${f}', system-ui`,
                                            textAlign: 'left',
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {f} — Aa Bb Cc 123
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-400 text-sm font-mono mb-2">Font Size</label>
                            <div className="flex gap-2">
                                {[
                                    { id: 'small', label: 'Small', size: '14px' },
                                    { id: 'base', label: 'Medium', size: '16px' },
                                    { id: 'large', label: 'Large', size: '18px' },
                                ].map(({ id, label, size }) => (
                                    <button
                                        key={id}
                                        onClick={() => update({ fontSize: id })}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: settings.fontSize === id
                                                ? `1px solid ${currentTheme.preview[0]}`
                                                : '1px solid #21262d',
                                            background: settings.fontSize === id ? `${currentTheme.preview[0]}15` : '#161b22',
                                            color: settings.fontSize === id ? currentTheme.preview[0] : '#9ca3af',
                                            cursor: 'pointer',
                                            fontSize: size,
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Panel */}
            <div className="cyber-card mt-6">
                <h2 className="text-lg font-bold text-white mb-3">Live Preview</h2>
                <p className="text-gray-500 text-xs font-mono mb-4">This card shows how your portfolio looks with the current settings.</p>
                <div
                    className="rounded-lg overflow-hidden border border-cyber-border"
                    style={{
                        filter: `hue-rotate(${currentTheme.hue}deg) brightness(${settings.brightness}) contrast(${settings.contrast}) saturate(${settings.saturation})`,
                    }}
                >
                    <div style={{ background: '#0a0a0f', padding: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: '20px', fontWeight: 'bold' }}>&lt;SR/&gt;</span>
                            {['Home', 'Skills', 'Projects', 'Blog'].map((n) => (
                                <span key={n} style={{ color: '#6b7280', fontSize: '13px' }}>{n}</span>
                            ))}
                        </div>
                        <div style={{ color: '#00ff41', fontFamily: 'monospace', fontSize: '11px', marginBottom: '8px' }}>// Portfolio Preview</div>
                        <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '4px' }}>Siva R</h2>
                        <p style={{ color: '#00d4ff', fontSize: '14px', marginBottom: '12px' }}>Cybersecurity Enthusiast</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ background: '#00ff4120', border: '1px solid #00ff4150', color: '#00ff41', borderRadius: '6px', padding: '4px 12px', fontSize: '12px' }}>View Work</span>
                            <span style={{ background: '#bd00ff20', border: '1px solid #bd00ff50', color: '#bd00ff', borderRadius: '6px', padding: '4px 12px', fontSize: '12px' }}>Contact</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
