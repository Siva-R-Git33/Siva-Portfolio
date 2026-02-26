import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { FaHome, FaBriefcase, FaCode, FaCertificate, FaCalendarAlt, FaPenNib, FaEnvelope, FaShieldAlt, FaTerminal } from 'react-icons/fa';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);

    // Toggle the menu when ⌘K or CTRL+K is pressed
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    // Handle routing navigation
    const navigateTo = (path, isHash = true) => {
        setOpen(false);
        if (isHash) {
            // Wait a tiny bit for the dialog to close before native smooth scroll
            setTimeout(() => {
                const element = document.querySelector(path);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else if (window.location.pathname !== '/') {
                    window.location.href = `/${path}`;
                }
            }, 100);
        } else {
            window.location.href = path;
        }
    };

    return (
        <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
            <div cmdk-overlay=""></div>
            <div cmdk-dialog="">
                <Command cmdk-root="">
                    <Command.Input cmdk-input="" placeholder="Search or jump to... (e.g., 'Projects', 'Lab')" autoFocus />

                    <Command.List cmdk-list="">
                        <Command.Empty cmdk-empty="">No results found. Keep hacking!</Command.Empty>

                        <Command.Group cmdk-group="" heading="Navigation">
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#home')}>
                                <FaHome /> Home
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#about')}>
                                <FaTerminal /> About Me
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#skills')}>
                                <FaCode /> Skills Matrix
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#projects')}>
                                <FaBriefcase /> Projects
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#certifications')}>
                                <FaCertificate /> Certifications
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#events')}>
                                <FaCalendarAlt /> Events
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#blog')}>
                                <FaPenNib /> Blog
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('#contact')}>
                                <FaEnvelope /> Contact
                            </Command.Item>
                        </Command.Group>

                        <Command.Group cmdk-group="" heading="Specialized Tools">
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('/lab', false)}>
                                <FaShieldAlt className="text-neon-red" /> Enter Security Lab
                            </Command.Item>
                            <Command.Item cmdk-item="" onSelect={() => navigateTo('/admin', false)}>
                                <FaTerminal className="text-neon-blue" /> Admin Login
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </Command.Dialog>
    );
}
