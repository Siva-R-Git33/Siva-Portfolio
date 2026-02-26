import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FaSave, FaGripLines, FaEye, FaEyeSlash } from 'react-icons/fa';
import { settingsAPI } from '../utils/api';

const DEFAULT_LAYOUT = [
    { id: 'Hero', active: true },
    { id: 'About', active: true },
    { id: 'Skills', active: true },
    { id: 'Projects', active: true },
    { id: 'Certifications', active: true },
    { id: 'Events', active: true },
    { id: 'Blog', active: true },
    { id: 'Contact', active: true }
];

export default function ManageLayout() {
    const [layout, setLayout] = useState(DEFAULT_LAYOUT);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        settingsAPI.get('site_layout')
            .then(res => {
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    // Merge saved layout with default to ensure all components exist
                    const savedIds = res.data.map(item => typeof item === 'string' ? item : item.id);

                    // Normalize legacy array of strings into object array
                    const normalizedSaved = res.data.map(item =>
                        typeof item === 'string' ? { id: item, active: true } : item
                    );

                    // Add any missing new components to the end
                    const missing = DEFAULT_LAYOUT.filter(d => !savedIds.includes(d.id));
                    setLayout([...normalizedSaved, ...missing]);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            await settingsAPI.update('site_layout', layout);
            setMessage({ text: 'Layout configuration saved successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to save layout configuration. Check console.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const toggleVisibility = (id) => {
        setLayout(layout.map(item => item.id === id ? { ...item, active: !item.active } : item));
    };

    if (loading) {
        return <div className="text-center py-20 text-neon-green/50 animate-pulse font-mono">Loading Config...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Dynamic Layout Manager</h1>
                    <p className="text-gray-400 text-sm font-mono">Drag and drop sections to reorder your homepage layout.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="cyber-btn-solid flex items-center gap-2"
                >
                    <FaSave /> {saving ? 'Saving...' : 'Save Layout'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 mb-6 rounded-lg font-mono text-sm border ${message.type === 'success' ? 'bg-neon-green/10 border-neon-green/50 text-neon-green' : 'bg-neon-red/10 border-neon-red/50 text-neon-red'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-cyber-dark/50 border border-cyber-border rounded-xl p-6">
                <Reorder.Group axis="y" values={layout} onReorder={setLayout} className="space-y-3">
                    {layout.map((comp) => (
                        <Reorder.Item
                            key={comp.id}
                            value={comp}
                            className={`flex items-center justify-between p-4 rounded-lg border backdrop-blur-sm cursor-grab active:cursor-grabbing transition-colors ${comp.active ? 'bg-cyber-gray border-cyber-border/80 text-white' : 'bg-cyber-gray/50 border-cyber-border/30 text-gray-500'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <FaGripLines className="text-gray-500 cursor-grab" />
                                <span className="font-semibold">{comp.id} Section</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => toggleVisibility(comp.id)}
                                    className={`p-2 rounded-md transition-colors ${comp.active ? 'text-neon-blue hover:bg-neon-blue/10' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                                    title={comp.active ? 'Disable Section' : 'Enable Section'}
                                >
                                    {comp.active ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>

            <div className="mt-6 p-4 border border-neon-blue/20 bg-neon-blue/5 rounded-lg text-sm text-gray-300 font-mono">
                <strong>Note:</strong> Disabling a section here removes it entirely from the homepage and navigation bar, regardless of other feature flags.
            </div>
        </div>
    );
}
