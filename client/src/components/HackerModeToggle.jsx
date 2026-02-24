import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTerminal } from 'react-icons/fa';
import { settingsAPI } from '../utils/api';

export default function HackerModeToggle() {
    const [showToggle, setShowToggle] = useState(false);
    const [hackerMode, setHackerMode] = useState(false);

    useEffect(() => {
        settingsAPI.get('feature_flags').then(res => {
            if (res.data?.showHackerModeToggle) {
                setShowToggle(true);
            }
        }).catch(console.error);

        // Cleanup on unmount
        return () => document.body.classList.remove('hacker-mode');
    }, []);

    const toggleHackerMode = () => {
        const newState = !hackerMode;
        setHackerMode(newState);
        if (newState) {
            document.body.classList.add('hacker-mode');
        } else {
            document.body.classList.remove('hacker-mode');
        }
    };

    if (!showToggle) return null;

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleHackerMode}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg border-2 backdrop-blur-md transition-colors duration-300 ${hackerMode
                    ? 'bg-[#001100] border-[#00ff00] text-[#00ff00] shadow-[0_0_15px_#00ff00]'
                    : 'bg-cyber-dark border-cyber-border text-gray-400 hover:text-neon-green hover:border-neon-green'
                }`}
            title="Toggle Hacker Mode"
        >
            <FaTerminal className="text-xl" />
        </motion.button>
    );
}
