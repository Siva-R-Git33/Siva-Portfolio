import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { settingsAPI } from '../utils/api';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Events', href: '#events' },
    { name: 'Blog', href: '#blog' },
    { name: 'Labs', href: '/lab', isPage: true },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [showSecurityLab, setShowSecurityLab] = useState(true);
    const [showEvents, setShowEvents] = useState(true);
    const [layout, setLayout] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        settingsAPI.get('site_layout').then(res => {
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                const normalizedSaved = res.data.map(item =>
                    typeof item === 'string' ? { id: item, active: true } : item
                );
                setLayout(normalizedSaved);
            } else {
                setLayout([
                    { id: 'Hero', active: true }, { id: 'About', active: true }, { id: 'Skills', active: true },
                    { id: 'Projects', active: true }, { id: 'Certifications', active: true }, { id: 'Events', active: true },
                    { id: 'Blog', active: true }, { id: 'Contact', active: true }
                ]);
            }
        }).catch(() => { });

        settingsAPI.get('feature_flags').then(res => {
            if (res.data) {
                if (res.data.showSecurityLab === false) setShowSecurityLab(false);
                if (res.data.showEventsSection === false) setShowEvents(false);
            }
        }).catch(() => { });

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            if (location.pathname === '/') {
                const sectionIds = [];
                if (layout.length > 0) {
                    layout.filter(s => s.active).forEach(s => {
                        const name = s.id === 'Hero' ? 'home' : s.id.toLowerCase();
                        sectionIds.push(name);
                    });
                } else {
                    navLinks.filter(l => !l.isPage).forEach(l => {
                        sectionIds.push(l.href.replace('#', ''));
                    });
                }

                for (let i = sectionIds.length - 1; i >= 0; i--) {
                    const el = document.getElementById(sectionIds[i]);
                    if (el && el.getBoundingClientRect().top <= 150) {
                        setActiveSection(sectionIds[i]);
                        break;
                    }
                }
            } else if (location.pathname === '/lab') {
                setActiveSection('/lab');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location, layout]);

    const handleNavClick = (linkObj) => {
        setMobileOpen(false);

        if (linkObj.isPage) {
            // Use React Router navigate for SPA transitions (no page reload)
            navigate(linkObj.href);
            return;
        }

        if (location.pathname !== '/') {
            // Navigate to home first, then let the hash handle scroll
            navigate('/' + linkObj.href);
            return;
        }
        const el = document.querySelector(linkObj.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // Compute Dynamic Rendered Links
    const renderedLinks = [];
    if (layout.length > 0) {
        layout.forEach(section => {
            if (!section.active) return;
            if (section.id === 'Events' && !showEvents) return;

            const sectionName = section.id === 'Hero' ? 'Home' : section.id;
            const matchingLink = navLinks.find(l => l.name === sectionName);
            if (matchingLink) renderedLinks.push(matchingLink);
        });
    } else {
        navLinks.filter(l => !l.isPage).forEach(l => {
            if (l.name === 'Events' && !showEvents) return;
            renderedLinks.push(l);
        });
    }
    navLinks.filter(l => l.isPage).forEach(l => {
        if (l.name === 'Labs' && !showSecurityLab) return;
        renderedLinks.push(l);
    });

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
                ? 'glass py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <motion.span
                        className="text-2xl font-bold font-mono neon-text"
                        whileHover={{ scale: 1.05 }}
                    >
                        {'<SR/>'}
                    </motion.span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {renderedLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => handleNavClick(link)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${activeSection === link.href.replace('#', '')
                                ? 'text-neon-green bg-neon-green/10'
                                : 'text-gray-400 hover:text-neon-green hover:bg-neon-green/5'
                                }`}
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-neon-green text-2xl"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <HiX /> : <HiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:hidden glass mt-2 mx-4 rounded-xl p-4"
                >
                    {renderedLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => handleNavClick(link)}
                            className="block w-full text-left px-4 py-3 text-gray-300 hover:text-neon-green hover:bg-neon-green/5 rounded-lg transition-all"
                        >
                            {link.name}
                        </button>
                    ))}
                </motion.div>
            )}
        </motion.nav>
    );
}
