import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate } from 'react-icons/fa';
import { certificationsAPI } from '../utils/api';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
};

export default function Certifications() {
    const [certifications, setCertifications] = useState([]);

    useEffect(() => {
        certificationsAPI.getAll()
            .then((res) => {
                if (res.data.length > 0) setCertifications(res.data);
            })
            .catch((err) => console.error("Failed to load certs:", err));
    }, []);

    // If API fails or is empty, use standard fallback
    const displayCerts = certifications.length > 0 ? certifications : [
        { name: 'Python Programming', issuer: 'NPTEL', color: 'neon-green' },
        { name: 'Ethical Hacking', issuer: 'NPTEL', color: 'neon-green' },
        { name: 'Networking Basics', issuer: 'Cisco', color: 'neon-blue' },
        { name: 'Cybersecurity Career Starter Certification', issuer: 'CCSC', color: 'neon-purple' },
        { name: 'Certified Phishing Prevention Specialist', issuer: 'CPPS', color: 'neon-red' },
    ];

    return (
        <section id="certifications" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Certifications</h2>
                    <p className="section-subtitle">Professional credentials and achievements</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {displayCerts.map((cert, i) => (
                        <motion.div
                            key={cert.id || i}
                            variants={cardVariants}
                            whileHover={{ scale: 1.03, y: -4 }}
                            className="cyber-card group cursor-default"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                  ${cert.color === 'neon-green' ? 'bg-neon-green/10 text-neon-green' : ''}
                  ${cert.color === 'neon-blue' ? 'bg-neon-blue/10 text-neon-blue' : ''}
                  ${cert.color === 'neon-purple' ? 'bg-neon-purple/10 text-neon-purple' : ''}
                  ${cert.color === 'neon-red' ? 'bg-neon-red/10 text-neon-red' : ''}
                `}>
                                    <FaCertificate className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1 group-hover:text-neon-green transition-colors">
                                        {cert.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-mono">{cert.issuer}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
