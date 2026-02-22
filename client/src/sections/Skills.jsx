import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaDesktop, FaShieldAlt, FaLock } from 'react-icons/fa';
import { skillsAPI } from '../utils/api';

const categoryIcons = {
    'Programming': FaCode,
    'Operating Systems': FaDesktop,
    'Cybersecurity Tools': FaShieldAlt,
    'Security Knowledge': FaLock,
};

const categoryColors = {
    'Programming': { border: 'border-neon-green/30', glow: 'hover:shadow-neon-green', text: 'text-neon-green' },
    'Operating Systems': { border: 'border-neon-blue/30', glow: 'hover:shadow-neon-blue', text: 'text-neon-blue' },
    'Cybersecurity Tools': { border: 'border-neon-purple/30', glow: 'hover:shadow-neon-purple', text: 'text-neon-purple' },
    'Security Knowledge': { border: 'border-neon-red/30', glow: '', text: 'text-neon-red' },
};

const fallbackSkills = {
    'Programming': ['Python', 'SQL', 'Bash', 'MATLAB'],
    'Operating Systems': ['Windows', 'Linux'],
    'Cybersecurity Tools': ['Kali Linux', 'Nmap', 'Metasploit'],
    'Security Knowledge': ['Networking', 'Malware Analysis', 'Log Analysis', 'Wazuh (SIEM)'],
};

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

export default function Skills() {
    const [grouped, setGrouped] = useState(fallbackSkills);

    useEffect(() => {
        skillsAPI.getAll()
            .then((res) => {
                const data = res.data;
                if (data.length > 0) {
                    const g = {};
                    data.forEach((skill) => {
                        if (!g[skill.category]) g[skill.category] = [];
                        g[skill.category].push(skill.name);
                    });
                    setGrouped(g);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <section id="skills" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Skills & Tools</h2>
                    <p className="section-subtitle">Technologies I work with</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {Object.entries(grouped).map(([category, skills]) => {
                        const Icon = categoryIcons[category] || FaCode;
                        const colors = categoryColors[category] || categoryColors['Programming'];

                        return (
                            <motion.div
                                key={category}
                                variants={cardVariants}
                                className={`cyber-card ${colors.border} ${colors.glow} transition-all duration-500`}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.text} bg-current/10`}
                                        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                    >
                                        <Icon className="text-lg" />
                                    </div>
                                    <h3 className={`text-lg font-bold ${colors.text}`}>{category}</h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <motion.span
                                            key={skill}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-cyber-gray/80 text-gray-300 border border-cyber-border hover:border-neon-green/30 hover:text-neon-green transition-all duration-300 cursor-default"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
