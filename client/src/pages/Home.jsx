import { useState, useEffect } from 'react';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Certifications from '../sections/Certifications';
import Events from '../sections/Events';
import Blog from '../sections/Blog';
import Contact from '../sections/Contact';
import { settingsAPI } from '../utils/api';

const COMPONENT_MAP = {
    Hero,
    About,
    Skills,
    Projects,
    Certifications,
    Events,
    Blog,
    Contact
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

export default function Home() {
    const [layout, setLayout] = useState(DEFAULT_LAYOUT);
    const [loading, setLoading] = useState(true);

    // Feature Flags Overrides
    const [showEvents, setShowEvents] = useState(true);

    useEffect(() => {
        // Fetch Layout Config
        settingsAPI.get('site_layout')
            .then(res => {
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    const normalizedSaved = res.data.map(item =>
                        typeof item === 'string' ? { id: item, active: true } : item
                    );
                    setLayout(normalizedSaved);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));

        // Fetch Feature Flags for internal component logic if needed
        settingsAPI.get('feature_flags').then(res => {
            if (res.data && res.data.showEventsSection === false) {
                setShowEvents(false);
            }
        }).catch(() => { });
    }, []);

    // Filter layout based on active explicitly, and feature flags implicitly
    const activeLayout = layout.filter(section => {
        if (!section.active) return false;
        // Apply secondary feature flags safely
        if (section.id === 'Events' && !showEvents) return false;
        return true;
    });

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-cyber-black text-neon-green animate-pulse font-mono">Initializing Neural Net...</div>;
    }

    return (
        <main>
            {activeLayout.map((section) => {
                const Component = COMPONENT_MAP[section.id];
                if (!Component) return null;
                return <Component key={section.id} />;
            })}
        </main>
    );
}
