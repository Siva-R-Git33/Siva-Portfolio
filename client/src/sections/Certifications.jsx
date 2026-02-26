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
                    {displayCerts.map((cert, i) => {
                        const isImage = cert.file_url && !cert.file_url.toLowerCase().endsWith('.pdf');

                        const CardContent = (
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden
                  ${!isImage && cert.color === 'neon-green' ? 'bg-neon-green/10 text-neon-green' : ''}
                  ${!isImage && cert.color === 'neon-blue' ? 'bg-neon-blue/10 text-neon-blue' : ''}
                  ${!isImage && cert.color === 'neon-purple' ? 'bg-neon-purple/10 text-neon-purple' : ''}
                  ${!isImage && cert.color === 'neon-red' ? 'bg-neon-red/10 text-neon-red' : ''}
                  ${isImage ? 'bg-cyber-gray border border-cyber-border/50' : ''}
                `}>
                                    {isImage ? (
                                        <img src={cert.file_url} alt={cert.name} className="w-full h-full object-cover" loading="lazy" />
                                    ) : (
                                        <FaCertificate className="text-xl" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-semibold mb-1 group-hover:text-neon-green transition-colors truncate">
                                        {cert.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm font-mono truncate">{cert.issuer}</p>
                                </div>
                            </div>
                        );

                        return (
                            <motion.div
                                key={cert.id || i}
                                variants={cardVariants}
                                whileHover={{ scale: 1.03, y: -4 }}
                                className="cyber-card group"
                            >
                                {cert.file_url ? (
                                    <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                                        {CardContent}
                                    </a>
                                ) : (
                                    <div className="cursor-default">
                                        {CardContent}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
