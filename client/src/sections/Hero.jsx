import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiTryhackme } from 'react-icons/si';
import { HiMail } from 'react-icons/hi';
import { settingsAPI } from '../utils/api';
import CyberGlobe from '../components/CyberGlobe';

const defaultHero = {
    name: 'Siva R',
    titles: ['Cybersecurity Enthusiast', 'Ethical Hacker'],
    description: 'Aspiring Ethical Hacker and Blue Team professional focused on vulnerability assessment, threat detection, and responsible cybersecurity practices.',
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
    const [activeResumeUrl, setActiveResumeUrl] = useState('');
    const [heroProfile, setHeroProfile] = useState({ enabled: false, url: '', position: 'left' });
    const [trackingEnabled, setTrackingEnabled] = useState(false);

    const [roleIndex, setRoleIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        Promise.all([
            settingsAPI.get('hero_content'),
            settingsAPI.get('social_links'),
            settingsAPI.get('resumeVersions'),
            settingsAPI.get('hero_profile'),
            settingsAPI.get('feature_flags')
        ]).then(([hRes, sRes, rRes, hpRes, fRes]) => {
            if (hRes.data) setHero(hRes.data);
            if (sRes.data) setSocials(sRes.data);
            if (rRes.data && rRes.data.length > 0) {
                const active = rRes.data.find(v => v.active);
                if (active) setActiveResumeUrl(active.url);
            }
            if (hpRes.data) setHeroProfile(hpRes.data);
            if (fRes.data?.enableResumeTracking) setTrackingEnabled(true);
        }).catch(() => { });
    }, []);

    const handleResumeDownload = async () => {
        if (!activeResumeUrl) return;

        if (trackingEnabled) {
            try {
                // We'll import supabase directly here for the quick analytics insert 
                // to avoid building a whole new API class just for one RPC call.
                const { supabase } = await import('../utils/api');
                await supabase.from('analytics_logs').insert([
                    { event_type: 'resume_download', details: { url: activeResumeUrl } }
                ]);
            } catch (error) {
                console.error('Analytics error:', error);
            }
        }

        window.open(activeResumeUrl, '_blank');
    };

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
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-10">

            {/* 3D Background Canvas */}
            <div className="absolute inset-0 z-0">
                <CyberGlobe />
            </div>

            {/* Gradient orbs (placed behind content but over the 3D globe for lighting effects) */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl z-0" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-blue/5 rounded-full blur-3xl z-0" />


            <div className="relative z-10 max-w-6xl mx-auto px-4 w-full">
                <div className={`flex flex-col items-center justify-center gap-12 ${heroProfile.enabled ? (heroProfile.position === 'right' ? 'md:flex-row-reverse md:justify-between' : 'md:flex-row md:justify-between') : ''}`}>

                    {/* Optional Profile Picture */}
                    {heroProfile.enabled && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                            className="w-64 h-64 md:w-80 md:h-80 shrink-0 relative order-first md:order-none"
                        >
                            <div className="absolute inset-0 bg-neon-green/20 rounded-full blur-2xl animate-pulse" />
                            <div className="w-full h-full rounded-full border-4 border-cyber-border overflow-hidden relative z-10 p-2 bg-cyber-black">
                                <img src={heroProfile.url || 'https://api.dicebear.com/7.x/bottts/svg?seed=hacker&backgroundColor=transparent'} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            </div>
                        </motion.div>
                    )}

                    {/* Text Content */}
                    <div className={`flex-1 max-w-2xl ${heroProfile.enabled ? 'text-center md:text-left' : 'text-center mx-auto'}`}>
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
                            className={`text-xl md:text-2xl lg:text-3xl font-mono text-gray-300 mb-6 h-10 ${heroProfile.enabled ? 'justify-center md:justify-start' : 'justify-center'} flex items-center`}
                        >
                            <span className="text-neon-green">&gt; </span>
                            <span className="ml-2">{displayText}</span>
                            <span className="text-neon-green animate-blink-caret border-r-2 border-neon-green ml-1 h-[1.2em]">&nbsp;</span>
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                            className={`text-gray-400 text-lg md:text-xl mb-10 leading-relaxed ${heroProfile.enabled ? '' : 'max-w-2xl mx-auto'}`}
                        >
                            {hero.description}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1 }}
                            className={`flex flex-col sm:flex-row gap-4 mb-10 ${heroProfile.enabled ? 'justify-center md:justify-start' : 'justify-center items-center'}`}
                        >
                            <a href="#projects" className="cyber-btn-solid text-center">
                                View Projects
                            </a>
                            {activeResumeUrl && (
                                <button onClick={handleResumeDownload} className="cyber-btn text-center">
                                    Download Resume
                                </button>
                            )}
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                            className={`flex gap-6 ${heroProfile.enabled ? 'justify-center md:justify-start' : 'justify-center items-center'}`}
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
                    </div>
                </div>

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
