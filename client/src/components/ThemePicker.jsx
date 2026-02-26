import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPalette, FaTimes } from 'react-icons/fa';
import { THEMES, setLocalTheme } from '../hooks/useTheme';

export default function ThemePicker() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTheme, setActiveTheme] = useState('cyber-green');

    useEffect(() => {
        const localTheme = localStorage.getItem('userTheme');
        if (localTheme) {
            setActiveTheme(localTheme);
        }
    }, [isOpen]);

    const handleThemeSelect = (themeId) => {
        setActiveTheme(themeId);
        setLocalTheme(themeId);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="absolute bottom-16 left-0 mb-2 p-4 rounded-xl glass border border-cyber-border shadow-2xl min-w-[200px]"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-mono text-gray-300">Set Theme</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <FaTimes size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => handleThemeSelect(theme.id)}
                                    className={`relative p-2 rounded-lg border transition-all duration-200 flex flex-col items-center gap-2
                                        ${activeTheme === theme.id ? 'border-white bg-white/10' : 'border-cyber-border hover:border-gray-500 hover:bg-white/5'}
                                    `}
                                    title={theme.name}
                                >
                                    <div className="flex w-full h-4 rounded overflow-hidden">
                                        {theme.preview.map((color, idx) => (
                                            <div key={idx} className="flex-1" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                                        {theme.name.split(' ')[0]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300
                    ${isOpen ? 'bg-white text-black scale-90' : 'bg-cyber-dark border border-cyber-border text-gray-400 hover:text-white hover:border-white hover:scale-110'}
                `}
                title="Change Theme"
            >
                <FaPalette size={20} />
            </button>
        </div>
    );
}
