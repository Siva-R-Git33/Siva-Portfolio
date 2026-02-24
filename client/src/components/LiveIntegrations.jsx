import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaShieldAlt } from 'react-icons/fa';
import { settingsAPI } from '../utils/api';

export default function LiveIntegrations() {
    const [show, setShow] = useState(false);
    const [githubUsername, setGithubUsername] = useState('Siva-R-Git33');
    const [thmUsername, setThmUsername] = useState('rsshiva403');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch feature flag
        settingsAPI.get('feature_flags')
            .then(res => {
                if (res.data?.showLiveIntegrations) {
                    setShow(true);
                    // We could also dynamically fetch usernames from About content if needed in the future
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading || !show) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full space-y-8"
        >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* GitHub Live Graph */}
                <div className="xl:col-span-2 cyber-card flex flex-col justify-center overflow-hidden">
                    <h3 className="text-xl font-bold text-neon-green mb-6 flex items-center gap-2">
                        <FaGithub /> Live GitHub Activity
                    </h3>
                    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
                        {/* ghchart uses hex code without the # for color mapping */}
                        <img
                            src={`https://ghchart.rshah.org/00ff00/${githubUsername}`}
                            alt={`${githubUsername}'s Github chart`}
                            className="min-w-[700px] w-full object-contain filter drop-shadow-[0_0_8px_rgba(0,255,0,0.3)] brightness-125"
                        />
                    </div>
                </div>

                {/* TryHackMe Live Badge */}
                <div className="xl:col-span-1 cyber-card flex flex-col justify-center items-center">
                    <h3 className="text-xl font-bold text-neon-blue mb-6 flex items-center gap-2 w-full">
                        <FaShieldAlt /> TryHackMe Stats
                    </h3>
                    <div className="flex-1 flex items-center justify-center w-full">
                        <a href={`https://tryhackme.com/p/${thmUsername}`} target="_blank" rel="noopener noreferrer" className="block transform hover:scale-105 transition-transform duration-300">
                            <img
                                src={`https://tryhackme-badges.s3.amazonaws.com/${thmUsername}.png`}
                                alt="TryHackMe Badge"
                                className="w-full max-w-[320px] rounded-lg shadow-[0_0_15px_rgba(0,234,255,0.2)]"
                                onError={(e) => {
                                    e.target.style.display = 'none'; // Hide if THM badge generation fails
                                }}
                            />
                        </a>
                    </div>
                    <p className="text-xs text-gray-500 mt-6 font-mono text-center">Live data fetched directly from public profiles.</p>
                </div>

            </div>
        </motion.div>
    );
}
