import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBullseye, FaMapMarkerAlt, FaGamepad, FaDumbbell, FaMusic, FaPlane, FaStar } from 'react-icons/fa';
import Terminal from '../components/Terminal';
import { settingsAPI } from '../utils/api';

const defaultAbout = {
    objective: 'Aspiring Ethical Hacker and Blue Team professional focused on vulnerability assessment, threat detection, and responsible cybersecurity practices. Seeking an entry-level opportunity to grow in offensive and defensive security domains.',
    location: 'Tenkasi, Tamil Nadu, India',
    education: [
        { degree: 'MSc Cyber Security', school: 'Bharathiar University', year: '2025 – Present', score: '' },
        { degree: 'BSc Computer Science (Cognitive Systems)', school: 'Karpagam Academy of Higher Education', year: '2021 – 2024', score: '88.30%' },
    ],
    hobbies: ['Playing Cricket', 'Exercise', 'Listening Music', 'Traveling'],
    platforms: [
        { name: 'TryHackMe', tag: 'Primary', link: 'https://tryhackme.com/p/rsshiva403' },
        { name: 'Hack The Box', tag: 'HTB', link: '' },
    ]
};

const hobbyIcons = {
    'Playing Cricket': FaGamepad,
    'Exercise': FaDumbbell,
    'Listening Music': FaMusic,
    'Traveling': FaPlane,
    'Default': FaStar
};

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function About() {
    const [about, setAbout] = useState(defaultAbout);

    useEffect(() => {
        settingsAPI.get('about_content')
            .then(res => { if (res.data) setAbout(res.data); })
            .catch(() => { });
    }, []);

    const getHobbyIcon = (name) => {
        return hobbyIcons[name] || hobbyIcons['Default'];
    };

    return (
        <section id="about" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">About Me</h2>
                    <p className="section-subtitle">Get to know me and my journey</p>
                </motion.div>

                {/* Terminal */}
                <div className="mb-16">
                    <Terminal />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Education Timeline */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-bold text-neon-green mb-6 flex items-center gap-2">
                            <FaGraduationCap /> Education
                        </h3>
                        <div className="space-y-4">
                            {about.education?.map((edu, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="cyber-card relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-neon-green/20"
                                >
                                    <div className="absolute left-1.5 top-6 w-3 h-3 rounded-full bg-neon-green shadow-neon-green" />
                                    <h4 className="text-white font-semibold">{edu.degree}</h4>
                                    <p className="text-gray-400 text-sm">{edu.school}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-neon-blue text-xs font-mono">{edu.year}</span>
                                        {edu.score && (
                                            <span className="text-neon-green text-xs font-mono px-2 py-0.5 rounded-full bg-neon-green/10">
                                                {edu.score}
                                            </span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Objective + Hobbies */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="cyber-card"
                        >
                            <h3 className="text-xl font-bold text-neon-blue mb-4 flex items-center gap-2">
                                <FaBullseye /> Career Objective
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                {about.objective}
                            </p>
                            {about.location && (
                                <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                                    <FaMapMarkerAlt className="text-neon-green" />
                                    {about.location}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="cyber-card"
                        >
                            <h3 className="text-xl font-bold text-neon-blue mb-4">🎯 Hobbies</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {about.hobbies?.map((hobby, i) => {
                                    const Icon = getHobbyIcon(hobby);
                                    return (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-gray-300 text-sm px-3 py-2 rounded-lg bg-cyber-gray/50"
                                        >
                                            <Icon className="text-neon-green" />
                                            {hobby}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* Hands-on Platforms */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="cyber-card"
                        >
                            <h3 className="text-xl font-bold text-neon-green mb-4">🧪 Hands-on Platforms</h3>
                            <div className="space-y-2">
                                {about.platforms?.map((platform, i) => (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-cyber-gray/50">
                                        <span className="text-gray-300 text-sm">
                                            {platform.link ? (
                                                <a href={platform.link} target="_blank" rel="noopener noreferrer" className="hover:text-neon-green transition-colors">
                                                    {platform.name}
                                                </a>
                                            ) : (
                                                platform.name
                                            )}
                                        </span>
                                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green">
                                            {platform.tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
