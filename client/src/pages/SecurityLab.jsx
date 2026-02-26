import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaShieldAlt, FaKey, FaGlobe, FaCogs, FaExclamationTriangle } from 'react-icons/fa';
import PasswordChecker from '../components/tools/PasswordChecker';
import HeaderAnalyzer from '../components/tools/HeaderAnalyzer';
import JwtDecoder from '../components/tools/JwtDecoder';
import DnsLookup from '../components/tools/DnsLookup';
import HashGenerator from '../components/tools/HashGenerator';

const tools = [
    { id: 'password', name: 'Password Strength', icon: FaKey },
    { id: 'headers', name: 'Header Analyzer', icon: FaGlobe },
    { id: 'jwt', name: 'JWT Decoder', icon: FaCogs },
    { id: 'dns', name: 'DNS Lookup', icon: FaGlobe },
    { id: 'hash', name: 'Hash Generator', icon: FaShieldAlt },
];

export default function SecurityLab() {
    const [activeTool, setActiveTool] = useState('password');

    // Scroll to top on load since this is a new standalone page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <Helmet>
                <title>Security Lab | Siva R</title>
                <meta name="description" content="Interactive cybersecurity tools for educational purposes, including password entropy analysis, HTTP security header inspection, and JWT decoding." />
            </Helmet>

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neon-green/10 mb-6"
                    animate={{ boxShadow: ['0 0 0px rgba(0,255,65,0)', '0 0 20px rgba(0,255,65,0.3)', '0 0 0px rgba(0,255,65,0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <FaShieldAlt className="text-4xl text-neon-green" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Security <span className="neon-text">Lab</span></h1>
                <p className="text-gray-400 max-w-2xl mx-auto font-mono text-sm leading-relaxed">
                    A suite of interactive, client-side tools designed for security analysis and engineering.
                </p>

                {/* Disclaimer Alert */}
                <div className="mt-8 inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-6 py-3 rounded-lg text-sm font-mono text-left max-w-3xl">
                    <FaExclamationTriangle className="text-2xl shrink-0" />
                    <p>
                        <strong>Educational Use Only:</strong> These tools process data entirely within your browser (except the Header Analyzer proxy). Do not paste production secrets or live active JWTs.
                    </p>
                </div>
            </motion.div>

            {/* Tool Navigation Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap justify-center gap-2 mb-8 bg-cyber-dark/50 p-2 rounded-xl border border-cyber-border backdrop-blur-sm max-w-3xl mx-auto"
            >
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-bold transition-all duration-300 ${activeTool === tool.id
                            ? 'bg-neon-green text-cyber-black shadow-[0_0_15px_rgba(0,255,65,0.3)]'
                            : 'text-gray-400 hover:text-white hover:bg-cyber-gray'
                            }`}
                    >
                        <tool.icon className={activeTool === tool.id ? 'text-cyber-black' : 'text-neon-green'} />
                        {tool.name}
                    </button>
                ))}
            </motion.div>

            {/* Tool Viewer Container */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl mx-auto bg-cyber-dark/30 border border-cyber-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-md min-h-[500px]"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTool}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTool === 'password' && <PasswordChecker />}
                        {activeTool === 'headers' && <HeaderAnalyzer />}
                        {activeTool === 'jwt' && <JwtDecoder />}
                        {activeTool === 'dns' && <DnsLookup />}
                        {activeTool === 'hash' && <HashGenerator />}
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* CTA Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-16 text-center"
            >
                <p className="text-gray-400 font-mono text-sm mb-4">Need a professional security audit for your application?</p>
                <a href="/#contact" className="cyber-btn-solid inline-flex px-8">Contact For Consulting</a>
            </motion.div>
        </div>
    );
}
