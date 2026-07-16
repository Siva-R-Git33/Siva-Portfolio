import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
    return (
        <section className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-lg"
            >
                {/* Icon */}
                <motion.div
                    className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-neon-red/10 mb-8 mx-auto"
                    animate={{ boxShadow: ['0 0 0px rgba(255,0,60,0)', '0 0 24px rgba(255,0,60,0.35)', '0 0 0px rgba(255,0,60,0)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <FaExclamationTriangle className="text-5xl text-neon-red" />
                </motion.div>

                {/* Error Code */}
                <h1 className="text-8xl font-black font-mono mb-2">
                    <span className="text-neon-red">4</span>
                    <span className="text-gray-100">0</span>
                    <span className="text-neon-red">4</span>
                </h1>

                {/* Terminal-style message */}
                <div className="terminal-window max-w-sm mx-auto mb-8">
                    <div className="terminal-header">
                        <div className="terminal-dot bg-red-500" />
                        <div className="terminal-dot bg-yellow-500" />
                        <div className="terminal-dot bg-green-500" />
                        <span className="ml-3 text-gray-400 text-xs font-mono">error</span>
                    </div>
                    <div className="terminal-body">
                        <p className="font-mono text-sm text-neon-red mb-1">&gt; page_not_found</p>
                        <p className="font-mono text-xs text-gray-400">The requested URL could not be located.</p>
                        <p className="font-mono text-xs text-gray-400 mt-1">Check the address and try again.</p>
                    </div>
                </div>

                {/* CTA */}
                <Link to="/" className="cyber-btn-solid inline-flex items-center gap-2 px-8">
                    <FaHome /> Return Home
                </Link>
            </motion.div>
        </section>
    );
}
