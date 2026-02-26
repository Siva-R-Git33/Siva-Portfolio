import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FaToggleOn, FaSave, FaChartLine, FaTerminal, FaFilter, FaBriefcase, FaEye, FaGripLines, FaEyeSlash, FaCalendarAlt } from 'react-icons/fa';
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
    showUpcomingEvents: true,
    showPastEvents: true,
};

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

const FLAG_CONFIG = [
    { key: 'showLiveIntegrations', title: 'Live Integrations (GitHub & THM)', desc: 'Show dynamic stats and live contribution graphs.', icon: FaChartLine },
    { key: 'showAdvancedTerminal', title: 'Interactive Cyber Terminal', desc: 'Enable file system commands and mini-games in the terminal.', icon: FaTerminal },
    { key: 'showHackerModeToggle', title: 'Hacker Mode Switch', desc: 'Add a global switch for extreme terminal-only aesthetics.', icon: FaEye },
    { key: 'showProjectFilters', title: 'Dynamic Content Filtering', desc: 'Enable tag/stack filtering for Projects and Blogs.', icon: FaFilter },
    { key: 'showHireMeModal', title: 'Freelance "Hire Me" Modal', desc: 'Add a specialized consulting inquiry form.', icon: FaBriefcase },
    { key: 'enableResumeTracking', title: 'Pro Analytics & Resume Tracking', desc: 'Log resume downloads and track basic site interactions.', icon: FaChartLine },
    { key: 'showSecurityLab', title: 'Security Lab Section', desc: 'Enable the standalone interactive cybersecurity tools page.', icon: FaTerminal },
    { key: 'showEventsSection', title: 'Master Events Toggle', desc: 'Enable/disable the entire Events section from the home page.', icon: FaEye },
    { key: 'showUpcomingEvents', title: 'Upcoming Events Sub-section', desc: 'Show the upcoming scheduled events timeline.', icon: FaCalendarAlt },
    { key: 'showPastEvents', title: 'Past Events Sub-section', desc: 'Show the events you have attended previously.', icon: FaCalendarAlt },
];

export default function ManageFeatures() {
    const [flags, setFlags] = useState(DEFAULT_FLAGS);
    const [layout, setLayout] = useState(DEFAULT_LAYOUT);

    const [loading, setLoading] = useState(true);
    const [savingFlags, setSavingFlags] = useState(false);
    const [savingLayout, setSavingLayout] = useState(false);

    const [messageFlags, setMessageFlags] = useState({ text: '', type: '' });
    const [messageLayout, setMessageLayout] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchFlags();
    }, []);

    const fetchFlags = async () => {
        try {
            const [flagsRes, layoutRes] = await Promise.all([
                settingsAPI.get('feature_flags'),
                settingsAPI.get('site_layout')
            ]);

            if (flagsRes.data) {
                setFlags({ ...DEFAULT_FLAGS, ...flagsRes.data });
            }

            if (layoutRes.data && Array.isArray(layoutRes.data) && layoutRes.data.length > 0) {
                const savedIds = layoutRes.data.map(item => typeof item === 'string' ? item : item.id);
                const normalizedSaved = layoutRes.data.map(item => typeof item === 'string' ? { id: item, active: true } : item);
                const missing = DEFAULT_LAYOUT.filter(d => !savedIds.includes(d.id));
                setLayout([...normalizedSaved, ...missing]);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessageFlags({ text: 'Failed to load configurations', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFlags = async () => {
        setSavingFlags(true);
        setMessageFlags({ text: '', type: '' });
        try {
            await settingsAPI.set('feature_flags', flags);
            setMessageFlags({ text: 'Feature flags updated successfully!', type: 'success' });
            setTimeout(() => setMessageFlags({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setMessageFlags({ text: error.message || 'Failed to save settings', type: 'error' });
        } finally {
            setSavingFlags(false);
        }
    };

    const handleSaveLayout = async () => {
        setSavingLayout(true);
        setMessageLayout({ text: '', type: '' });
        try {
            // FIXED BUG: using .set() instead of .update()
            await settingsAPI.set('site_layout', layout);
            setMessageLayout({ text: 'Layout configuration saved successfully!', type: 'success' });
            setTimeout(() => setMessageLayout({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error('Save layout error:', error);
            setMessageLayout({ text: 'Failed to save layout configuration. Check console.', type: 'error' });
        } finally {
            setSavingLayout(false);
        }
    };

    const handleToggle = (key) => {
        setFlags(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleLayoutVisibility = (id) => {
        setLayout(layout.map(item => item.id === id ? { ...item, active: !item.active } : item));
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
                    <span className="text-neon-purple">&gt;</span> Features & Layout
                </h1>
                <button
                    onClick={handleSaveFlags}
                    disabled={savingFlags}
                    className="cyber-btn-solid bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center gap-2 disabled:opacity-50"
                >
                    <FaSave />
                    {savingFlags ? 'Saving...' : 'Save Feature Flags'}
                </button>
            </div>

            {messageFlags.text && (
                <div className={`p-4 rounded-lg border ${messageFlags.type === 'success' ? 'bg-neon-green/10 border-neon-green text-neon-green' : 'bg-neon-red/10 border-neon-red text-neon-red'}`}>
                    {messageFlags.text}
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

            {/* Layout Manager Section */}
            <div className="mt-16 border-t border-cyber-border pt-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                            <span className="text-neon-blue">&gt;</span> Dynamic Layout Manager
                        </h2>
                        <p className="text-gray-400 text-sm font-mono">Drag and drop sections to reorder your homepage layout.</p>
                    </div>
                    <button
                        onClick={handleSaveLayout}
                        disabled={savingLayout}
                        className="cyber-btn-solid bg-neon-blue hover:bg-neon-blue/80 flex items-center gap-2 disabled:opacity-50"
                    >
                        <FaSave /> {savingLayout ? 'Saving...' : 'Save Layout'}
                    </button>
                </div>

                {messageLayout.text && (
                    <div className={`p-4 mb-6 rounded-lg font-mono text-sm border ${messageLayout.type === 'success' ? 'bg-neon-green/10 border-neon-green/50 text-neon-green' : 'bg-neon-red/10 border-neon-red/50 text-neon-red'}`}>
                        {messageLayout.text}
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
                                <div className="flex items-center gap-4 pointer-events-none">
                                    <FaGripLines className="text-gray-500 pointer-events-auto cursor-grab" />
                                    <span className="font-semibold pointer-events-none">{comp.id} Section</span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleLayoutVisibility(comp.id)}
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
                    <strong>Note:</strong> Disabling a section here removes it entirely from the homepage and navigation bar, regardless of individual feature flags above.
                </div>
            </div>
        </motion.div>
    );
}
