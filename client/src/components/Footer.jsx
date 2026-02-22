import { FaLinkedin, FaGithub, FaEnvelope, FaHeart } from 'react-icons/fa';
import { SiTryhackme } from 'react-icons/si';

const socialLinks = [
    { icon: FaLinkedin, href: 'https://linkedin.com/in/sivarr31', label: 'LinkedIn' },
    { icon: SiTryhackme, href: 'https://tryhackme.com/p/rsshiva403', label: 'TryHackMe' },
    { icon: FaGithub, href: 'https://github.com/Siva-R-Git33', label: 'GitHub' },
    { icon: FaEnvelope, href: 'mailto:shivar6277@gmail.com', label: 'Email' },
];

export default function Footer() {
    return (
        <footer className="border-t border-cyber-border bg-cyber-dark/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold font-mono neon-text">{'<SR/>'}</span>
                        <span className="text-gray-500 text-sm">|</span>
                        <span className="text-gray-400 text-sm">Cybersecurity Portfolio</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {socialLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-neon-green transition-colors duration-300 text-lg"
                                aria-label={link.label}
                            >
                                <link.icon />
                            </a>
                        ))}
                    </div>

                    <p className="text-gray-500 text-sm flex items-center gap-1">
                        Built with <FaHeart className="text-neon-green text-xs" /> by Siva R
                    </p>
                </div>
            </div>
        </footer>
    );
}
