import { motion } from 'framer-motion';
import { FaGraduationCap, FaBullseye, FaMapMarkerAlt, FaGamepad, FaDumbbell, FaMusic, FaPlane } from 'react-icons/fa';
import Terminal from '../components/Terminal';

const education = [
    {
        degree: 'MSc Cyber Security',
        school: 'Bharathiar University',
        year: '2025 – Present',
        score: null,
    },
    {
        degree: 'BSc Computer Science (Cognitive Systems)',
        school: 'Karpagam Academy of Higher Education',
        year: '2021 – 2024',
        score: '88.30%',
    },
    {
        degree: 'HSC',
        school: 'Nadar Committee Higher Secondary School',
        year: '2021',
        score: '85.54%',
    },
    {
        degree: 'SSLC',
        school: 'Nadar Committee Higher Secondary School',
        year: '2019',
        score: '79.20%',
    },
];

const hobbies = [
    { icon: FaGamepad, name: 'Playing Cricket' },
    { icon: FaDumbbell, name: 'Exercise' },
    { icon: FaMusic, name: 'Listening Music' },
    { icon: FaPlane, name: 'Traveling' },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function About() {
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
                            {education.map((edu, i) => (
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
                                Aspiring Ethical Hacker and Blue Team professional focused on vulnerability assessment,
                                threat detection, and responsible cybersecurity practices. Seeking an entry-level opportunity
                                to grow in offensive and defensive security domains.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
                                <FaMapMarkerAlt className="text-neon-green" />
                                Tenkasi, Tamil Nadu, India
                            </div>
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
                                {hobbies.map((hobby, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-gray-300 text-sm px-3 py-2 rounded-lg bg-cyber-gray/50"
                                    >
                                        <hobby.icon className="text-neon-green" />
                                        {hobby.name}
                                    </div>
                                ))}
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
                                {[
                                    { name: 'TryHackMe', tag: 'Primary', link: 'https://tryhackme.com/p/rsshiva403' },
                                    { name: 'Hack The Box', tag: 'HTB' },
                                    { name: 'Blue Team Labs Online', tag: 'BTLO' },
                                ].map((platform, i) => (
                                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-cyber-gray/50">
                                        <span className="text-gray-300 text-sm">{platform.name}</span>
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
