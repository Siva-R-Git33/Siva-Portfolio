import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

/**
 * <Spoiler> component — blurs its children until the user clicks to reveal.
 * Perfect for CTF writeup flag answers and sensitive solutions.
 *
 * Usage:
 *   <Spoiler label="Show Flag">FLAG{example_flag_here}</Spoiler>
 */
export default function Spoiler({ children, label = 'Click to reveal spoiler' }) {
    const [revealed, setRevealed] = useState(false);

    return (
        <div className="relative my-4">
            <motion.div
                className={`relative rounded-lg border overflow-hidden transition-all duration-500 ${revealed
                        ? 'border-neon-green/30 bg-neon-green/5'
                        : 'border-neon-red/30 bg-neon-red/5 cursor-pointer'
                    }`}
                onClick={() => !revealed && setRevealed(true)}
                whileHover={!revealed ? { scale: 1.01 } : {}}
            >
                {/* Blurred overlay when hidden */}
                {!revealed && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cyber-dark/80 backdrop-blur-md">
                        <FaEyeSlash className="text-2xl text-neon-red mb-2" />
                        <span className="text-sm font-mono text-gray-400">{label}</span>
                    </div>
                )}

                {/* Content — always rendered but blurred until revealed */}
                <div
                    className={`p-4 font-mono text-sm transition-all duration-500 ${revealed ? 'filter-none' : 'blur-lg select-none'
                        }`}
                >
                    {children}
                </div>
            </motion.div>

            {/* Collapse button after reveal */}
            {revealed && (
                <button
                    onClick={() => setRevealed(false)}
                    className="mt-1 text-xs text-gray-500 hover:text-neon-red transition-colors font-mono flex items-center gap-1"
                >
                    <FaEye /> Hide spoiler
                </button>
            )}
        </div>
    );
}
