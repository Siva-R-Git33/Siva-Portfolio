import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaPaperPlane, FaGithub } from 'react-icons/fa';
import { SiTryhackme } from 'react-icons/si';
import { contactAPI, settingsAPI } from '../utils/api';

const defaultSocials = {
    email: 'shivar6277@gmail.com',
    phone: '+91 9150782041',
    github: 'https://github.com/Siva-R-Git33',
    linkedin: 'https://linkedin.com/in/sivarr31',
    tryhackme: 'https://tryhackme.com/p/rsshiva403'
};

const defaultAbout = {};

export default function Contact() {
    const [socials, setSocials] = useState(defaultSocials);
    const [about, setAbout] = useState(defaultAbout);

    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState(null); // 'success' | 'error' | 'loading'
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        Promise.all([
            settingsAPI.get('social_links'),
            settingsAPI.get('about_content')
        ]).then(([sRes, aRes]) => {
            if (sRes.data) setSocials(sRes.data);
            if (aRes.data) setAbout(aRes.data);
        }).catch(() => { });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await contactAPI.send(form);
            setStatus('success');
            setStatusMsg('Message sent! I\'ll get back to you soon.');
            setForm({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(null), 5000);
        } catch {
            setStatus('error');
            setStatusMsg('Something went wrong. Please try again or email me directly.');
            setTimeout(() => setStatus(null), 5000);
        }
    };

    const contactInfo = [];
    if (socials.showEmail !== false) {
        contactInfo.push({ icon: FaEnvelope, label: 'Email', value: socials.email, href: socials.email ? `mailto:${socials.email}` : null });
    }
    if (socials.showPhone !== false) {
        contactInfo.push({ icon: FaPhone, label: 'Phone', value: socials.phone, href: socials.phone ? `tel:${socials.phone.replace(/[\s-]/g, '')}` : null });
    }
    if (socials.showLocation !== false && socials.location) {
        contactInfo.push({ icon: FaMapMarkerAlt, label: 'Location', value: socials.location });
    }

    // Filter out any purely empty values just in case
    const validContactInfo = contactInfo.filter(c => c.value);

    const socialIcons = [
        { icon: FaLinkedin, href: socials.linkedin, label: 'LinkedIn', color: 'hover:bg-blue-600/20 hover:text-blue-400' },
        { icon: FaGithub, href: socials.github, label: 'GitHub', color: 'hover:bg-gray-600/20 hover:text-gray-300' },
        { icon: SiTryhackme, href: socials.tryhackme, label: 'TryHackMe', color: 'hover:bg-neon-green/20 hover:text-neon-green' },
        { icon: FaEnvelope, href: socials.email ? `mailto:${socials.email}` : null, label: 'Email', color: 'hover:bg-neon-red/20 hover:text-neon-red' },
    ].filter(s => s.href);

    return (
        <section id="contact" className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title">Get in Touch</h2>
                    <p className="section-subtitle">Let's connect and discuss opportunities</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="cyber-card">
                            <h3 className="text-xl font-bold text-neon-green mb-6">Contact Information</h3>
                            <div className="space-y-4">
                                {validContactInfo.map((item) => (
                                    <div key={item.label} className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-neon-green/10 flex items-center justify-center shrink-0">
                                            <item.icon className="text-neon-green" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs uppercase tracking-wider">{item.label}</p>
                                            {item.href ? (
                                                <a href={item.href} className="text-gray-200 hover:text-neon-green transition-colors text-sm">
                                                    {item.value}
                                                </a>
                                            ) : (
                                                <p className="text-gray-200 text-sm">{item.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {validContactInfo.length === 0 && (
                                    <p className="text-gray-500 text-sm font-mono mt-4">Contact information is currently hidden.</p>
                                )}
                            </div>
                        </div>

                        <div className="cyber-card">
                            <h3 className="text-lg font-bold text-neon-blue mb-4">Connect with me</h3>
                            <div className="flex gap-3">
                                {socialIcons.map((social) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1 }}
                                        className={`w-12 h-12 rounded-xl bg-cyber-gray flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color}`}
                                    >
                                        <social.icon className="text-lg" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <form onSubmit={handleSubmit} className="cyber-card">
                            <h3 className="text-xl font-bold text-white mb-6">Send a message</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-3 text-white focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green/30 transition-all duration-300 text-sm"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-3 text-white focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green/30 transition-all duration-300 text-sm"
                                        placeholder="your@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-3 text-white focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green/30 transition-all duration-300 text-sm resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full cyber-btn-solid flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <FaPaperPlane />
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </motion.button>
                            </div>

                            {/* Status Toast */}
                            {status && status !== 'loading' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-4 px-4 py-3 rounded-lg text-sm font-mono ${status === 'success'
                                        ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                                        : 'bg-neon-red/10 text-neon-red border border-neon-red/30'
                                        }`}
                                >
                                    {statusMsg}
                                </motion.div>
                            )}
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
