import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { settingsAPI, contactAPI } from '../utils/api';

export default function HireMeModal() {
    const [showWidget, setShowWidget] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    useEffect(() => {
        settingsAPI.get('feature_flags').then(res => {
            if (res.data?.showHireMeModal) setShowWidget(true);
        }).catch(console.error);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: `[CONSULTING INQUIRY]\nScope: ${formData.get('scope')}\nBudget: ${formData.get('budget')}\n\nDetails:\n${formData.get('details')}`
        };

        try {
            await contactAPI.submitForm(data);
            setStatus({ loading: false, success: true, error: null });
            setTimeout(() => {
                setIsOpen(false);
                setStatus({ loading: false, success: false, error: null });
            }, 3000);
        } catch (error) {
            setStatus({ loading: false, success: false, error: error.message || 'Failed to send inquiry.' });
        }
    };

    if (!showWidget) return null;

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 left-6 z-40 cyber-btn-solid bg-neon-purple text-white shadow-[0_0_15px_rgba(189,0,255,0.4)] flex items-center gap-2 px-4 py-3 rounded-full"
                >
                    <FaBriefcase className="text-xl" />
                    <span className="hidden md:inline font-bold">Hire Me</span>
                </motion.button>
            )}

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="cyber-card w-full max-w-md relative bg-cyber-dark/95 border-neon-purple shadow-[0_0_30px_rgba(189,0,255,0.15)]"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-neon-red transition-colors"
                            >
                                <FaTimes className="text-xl" />
                            </button>

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
                                    <span className="text-neon-purple">&gt;</span> Hire Me
                                </h3>
                                <p className="text-gray-400 text-sm">Send a direct inquiry for freelance pentesting, consulting, or blue team contracts.</p>
                            </div>

                            {status.success ? (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                                    <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaPaperPlane className="text-3xl text-neon-green" />
                                    </div>
                                    <p className="text-neon-green font-bold text-lg mb-2">Inquiry Sent!</p>
                                    <p className="text-gray-400 text-sm">I'll review your project scope and get back to you shortly.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono text-neon-purple mb-1">NAME</label>
                                            <input required name="name" type="text" className="w-full bg-cyber-black/50 border border-cyber-border rounded px-3 py-2 text-white focus:border-neon-purple outline-none transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-mono text-neon-purple mb-1">EMAIL</label>
                                            <input required name="email" type="email" className="w-full bg-cyber-black/50 border border-cyber-border rounded px-3 py-2 text-white focus:border-neon-purple outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-neon-purple mb-1">PROJECT SCOPE</label>
                                        <select required name="scope" className="w-full bg-cyber-black/50 border border-cyber-border rounded px-3 py-2 text-white focus:border-neon-purple outline-none transition-colors appearance-none">
                                            <option value="">Select scope...</option>
                                            <option value="Web App Pentest">Web App Penetration Testing</option>
                                            <option value="Network Vulnerability Assessment">Network Vulnerability Assessment</option>
                                            <option value="Security Consultation">General Security Consultation</option>
                                            <option value="Malware/Log Analysis">Malware / Log Analysis</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-neon-purple mb-1">ESTIMATED BUDGET</label>
                                        <select required name="budget" className="w-full bg-cyber-black/50 border border-cyber-border rounded px-3 py-2 text-white focus:border-neon-purple outline-none transition-colors appearance-none">
                                            <option value="">Select budget range...</option>
                                            <option value="<$500">&lt; $500</option>
                                            <option value="$500-$2000">$500 - $2,000</option>
                                            <option value="$2000+">$2,000+</option>
                                            <option value="To Be Discussed">To Be Discussed</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono text-neon-purple mb-1">PROJECT DETAILS</label>
                                        <textarea required name="details" rows="4" className="w-full bg-cyber-black/50 border border-cyber-border rounded px-3 py-2 text-white focus:border-neon-purple outline-none transition-colors custom-scrollbar" placeholder="Briefly describe your systems, requirements, and timeline..."></textarea>
                                    </div>

                                    {status.error && <p className="text-neon-red text-sm font-mono">{status.error}</p>}

                                    <button
                                        type="submit"
                                        disabled={status.loading}
                                        className="w-full cyber-btn border-neon-purple text-neon-purple hover:bg-neon-purple/20 hover:text-white hover:shadow-[0_0_15px_rgba(189,0,255,0.4)] disabled:opacity-50 mt-4"
                                    >
                                        {status.loading ? 'INITIATING TRANSMISSION...' : 'SEND INQUIRY'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
