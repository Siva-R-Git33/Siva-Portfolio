import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaToggleOn, FaSave, FaChartLine, FaTerminal, FaFilter, FaBriefcase, FaEye } from 'react-icons/fa';
import { settingsAPI } from '../utils/api';

const DEFAULT_FLAGS = {
    showLiveIntegrations: false,
    showAdvancedTerminal: false,
    showHackerModeToggle: false,
    showProjectFilters: false,
    showHireMeModal: false,
    enableResumeTracking: false,
    showSecurityLab: true,
    showEventsSection: true,
};

const FLAG_CONFIG = [
    { key: 'showLiveIntegrations', title: 'Live Integrations (GitHub & THM)', desc: 'Show dynamic stats and live contribution graphs.', icon: FaChartLine },
    { key: 'showAdvancedTerminal', title: 'Interactive Cyber Terminal', desc: 'Enable file system commands and mini-games in the terminal.', icon: FaTerminal },
    { key: 'showHackerModeToggle', title: 'Hacker Mode Switch', desc: 'Add a global switch for extreme terminal-only aesthetics.', icon: FaEye },
    { key: 'showProjectFilters', title: 'Dynamic Content Filtering', desc: 'Enable tag/stack filtering for Projects and Blogs.', icon: FaFilter },
    { key: 'showHireMeModal', title: 'Freelance "Hire Me" Modal', desc: 'Add a specialized consulting inquiry form.', icon: FaBriefcase },
    { key: 'enableResumeTracking', title: 'Pro Analytics & Resume Tracking', desc: 'Log resume downloads and track basic site interactions.', icon: FaChartLine },
    { key: 'showSecurityLab', title: 'Security Lab Section', desc: 'Enable the standalone interactive cybersecurity tools page.', icon: FaTerminal },
    { key: 'showEventsSection', title: 'Events Section', desc: 'Enable the interactive timeline of upcoming and past events.', icon: FaEye },
];

export default function ManageFeatures() {
    const [flags, setFlags] = useState(DEFAULT_FLAGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchFlags();
    }, []);

    const fetchFlags = async () => {
        try {
            const { data } = await settingsAPI.get('feature_flags');
            if (data) {
                setFlags({ ...DEFAULT_FLAGS, ...data });
            }
        } catch (error) {
            console.error('Error fetching feature flags:', error);
            setMessage({ text: 'Failed to load feature flags', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ text: '', type: '' });
        try {
            await settingsAPI.set('feature_flags', flags);
            setMessage({ text: 'Feature flags updated successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setMessage({ text: error.message || 'Failed to save settings', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleToggle = (key) => {
        setFlags(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-neon-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white font-mono flex items-center gap-3">
                    <span className="text-neon-purple">&gt;</span> Feature Flags
                </h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="cyber-btn-solid bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center gap-2 disabled:opacity-50"
                >
                    <FaSave />
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-neon-red/10 border-neon-red text-neon-red'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FLAG_CONFIG.map((flag) => (
                    <div key={flag.key} className="cyber-card group !bg-cyber-black/50 border border-cyber-border/50">
                        <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className={`p-3 rounded-lg ${flags[flag.key] ? 'bg-neon-green/10 text-neon-green' : 'bg-cyber-gray text-gray-400'}`}>
                                    <flag.icon className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-neon-purple transition-colors">{flag.title}</h3>
                                    <p className="text-sm text-gray-400">{flag.desc}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle(flag.key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${flags[flag.key] ? 'bg-neon-green' : 'bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flags[flag.key] ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-neon-blue/5 border border-neon-blue/20 rounded-lg">
                <h3 className="text-neon-blue font-mono font-bold text-lg mb-2">⚠ System Notice</h3>
                <p className="text-gray-400 text-sm">Disabling a feature flag will instantly hide the specific component or section from the public-facing portfolio. These changes take effect immediately upon saving.</p>
            </div>
        </motion.div>
    );
}
