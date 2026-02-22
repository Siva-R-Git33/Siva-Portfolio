import { useEffect, useState } from 'react';
import { settingsAPI } from '../utils/api';

const sections = [
    {
        key: 'showBlogSection',
        label: 'Blog Section',
        description: 'Show or hide the Blog & CTF Writeups section on your portfolio.',
        defaultValue: true,
    },
];

function Toggle({ value, onChange }) {
    return (
        <button
            onClick={onChange}
            style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                width: '56px',
                height: '28px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.3s',
                background: value ? '#00ff41' : '#1a1a2e',
                outline: '1px solid #2a2a4a',
            }}
        >
            <span
                style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    transition: 'transform 0.3s',
                    transform: value ? 'translateX(32px)' : 'translateX(4px)',
                }}
            />
        </button>
    );
}

export default function ManageSections() {
    const [values, setValues] = useState({});
    const [saving, setSaving] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        Promise.all(sections.map((s) => settingsAPI.get(s.key)))
            .then((results) => {
                const map = {};
                sections.forEach((s, i) => {
                    map[s.key] = results[i].data !== null ? results[i].data : s.defaultValue;
                });
                setValues(map);
                setLoaded(true);
            })
            .catch(() => {
                const map = {};
                sections.forEach((s) => { map[s.key] = s.defaultValue; });
                setValues(map);
                setLoaded(true);
            });
    }, []);

    const toggle = async (key) => {
        const next = !values[key];
        setValues((prev) => ({ ...prev, [key]: next }));
        setSaving((prev) => ({ ...prev, [key]: true }));
        try {
            await settingsAPI.set(key, next);
        } catch (e) {
            // revert
            setValues((prev) => ({ ...prev, [key]: !next }));
        } finally {
            setSaving((prev) => ({ ...prev, [key]: false }));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Section Visibility</h1>
            <p className="text-gray-400 text-sm mb-8">Toggle which sections are visible on your portfolio homepage.</p>

            {!loaded ? (
                <p className="text-gray-400">Loading...</p>
            ) : (
                <div className="space-y-4">
                    {sections.map((s) => (
                        <div key={s.key} className="cyber-card flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-semibold">{s.label}</h3>
                                <p className="text-gray-400 text-sm mt-1">{s.description}</p>
                                <p className="text-xs font-mono mt-2" style={{ color: values[s.key] ? '#00ff41' : '#6b7280' }}>
                                    {saving[s.key] ? 'Saving...' : values[s.key] ? '● Visible' : '○ Hidden'}
                                </p>
                            </div>
                            <Toggle value={values[s.key]} onChange={() => toggle(s.key)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
