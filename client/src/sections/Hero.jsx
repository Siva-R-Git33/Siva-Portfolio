import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiTryhackme } from 'react-icons/si';
import { HiMail } from 'react-icons/hi';
import { settingsAPI } from '../utils/api';

const defaultHero = {
    name: 'Siva R',
    titles: ['Cybersecurity Enthusiast', 'Ethical Hacker'],
    description: 'Aspiring Ethical Hacker and Blue Team professional focused on vulnerability assessment, threat detection, and responsible cybersecurity practices.',
    resumeUrl: '/Siva R-Resume.pdf'
};

const defaultSocials = {
    email: 'shivar6277@gmail.com',
    github: 'https://github.com/Siva-R-Git33',
    linkedin: 'https://linkedin.com/in/sivarr31',
    tryhackme: 'https://tryhackme.com/p/rsshiva403'
};

export default function Hero() {
    const [hero, setHero] = useState(defaultHero);
    const [socials, setSocials] = useState(defaultSocials);

    const [roleIndex, setRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        Promise.all([
            settingsAPI.get('hero_content'),
            settingsAPI.get('social_links')
        ]).then(([hRes, sRes]) => {
            if (hRes.data) setHero(hRes.data);
            if (sRes.data) setSocials(sRes.data);
        }).catch(() => { });
    }, []);

    useEffect(() => {
        const roles = hero.titles && hero.titles.length > 0 ? hero.titles : ['Loading...'];
        const currentRole = roles[roleIndex % roles.length];
        let timeout;

        if (!isDeleting && displayText === currentRole) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
        } else if (isDeleting && displayText === '') {
            setIsDeleting(false);
            setRoleIndex((prev) => (prev + 1));
        } else {
            timeout = setTimeout(
                () => {
                    setDisplayText(
                        isDeleting
                            ? currentRole.substring(0, displayText.length - 1)
                            : currentRole.substring(0, displayText.length + 1)
                    );
                },
                isDeleting ? 40 : 80
            );
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, roleIndex, hero.titles]);

    const socialIcons = [
        { icon: FaGithub, href: socials.github, label: 'GitHub' },
        { icon: FaLinkedin, href: socials.linkedin, label: 'LinkedIn' },
        { icon: SiTryhackme, href: socials.tryhackme, label: 'TryHackMe' },
        { icon: HiMail, href: `mailto:${socials.email}`, label: 'Email' },
    ].filter(s => s.href);

    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Gradient orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center mt-20 md:mt-0">
                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-4"
                >
                    <span className="inline-block px-4 py-2 rounded-full glass text-neon-green font-mono text-sm">
                        👋 Welcome to my cyber space
                    </span>
                </motion.div>

                {/* Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
                >
                    <span className="text-gray-100">I'm </span>
                    <span className="text-gradient">{hero.name}</span>
                </motion.h1>

                {/* Typing role */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-xl md:text-2xl lg:text-3xl font-mono text-gray-300 mb-8 h-10"
                >
                    <span className="text-neon-green">&gt; </span>
                    {displayText}
                    <span className="text-neon-green animate-blink-caret border-r-2 border-neon-green ml-1">&nbsp;</span>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    {hero.description}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                    <a href="#projects" className="cyber-btn-solid">
                        View Projects
                    </a>
                    {hero.resumeUrl && (
                        <a href={hero.resumeUrl} target="_blank" rel="noopener noreferrer" className="cyber-btn">
                            Download Resume
                        </a>
                    )}
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="flex items-center justify-center gap-6"
                >
                    {socialIcons.map((social) => (
                        <motion.a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-neon-green text-xl transition-all duration-300"
                            whileHover={{ scale: 1.2, y: -3 }}
                        >
                            <social.icon />
                        </motion.a>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <FaChevronDown className="text-neon-green/40 text-xl" />
                </motion.div>
            </div>
        </section>
    );
}
