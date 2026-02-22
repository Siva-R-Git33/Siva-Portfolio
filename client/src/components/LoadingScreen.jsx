import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';

function MatrixColumn({ delay, left }) {
    const [chars, setChars] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const newChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
            setChars((prev) => (prev.length > 25 ? newChar : prev + newChar));
        }, 50 + Math.random() * 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="absolute text-neon-green font-mono text-xs opacity-30"
            style={{
                left: `${left}%`,
                top: '-10%',
                animation: `matrixFall ${3 + Math.random() * 4}s linear ${delay}s infinite`,
                writingMode: 'vertical-rl',
            }}
        >
            {chars}
        </div>
    );
}

export default function LoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('Initializing systems...');

    useEffect(() => {
        const messages = [
            'Initializing systems...',
            'Loading security modules...',
            'Establishing secure connection...',
            'Decrypting portfolio data...',
            'Access granted ✓',
        ];

        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.random() * 15 + 5;
                if (next >= 100) {
                    clearInterval(interval);
                    setStatusText(messages[4]);
                    return 100;
                }
                const msgIndex = Math.min(Math.floor(next / 25), 3);
                setStatusText(messages[msgIndex]);
                return next;
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const columns = Array.from({ length: 20 }, (_, i) => i);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black overflow-hidden"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Matrix rain background */}
                <style>{`
          @keyframes matrixFall {
            0% { transform: translateY(-100vh); opacity: 0; }
            10% { opacity: 0.3; }
            90% { opacity: 0.3; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
        `}</style>
                <div className="absolute inset-0 overflow-hidden">
                    {columns.map((i) => (
                        <MatrixColumn
                            key={i}
                            delay={Math.random() * 3}
                            left={(i / columns.length) * 100}
                        />
                    ))}
                </div>

                {/* Logo / Title */}
                <motion.div
                    className="relative z-10 text-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="mb-8">
                        <motion.div
                            className="text-6xl font-bold neon-text font-mono mb-2"
                            animate={{ textShadow: ['0 0 7px #00ff41', '0 0 30px #00ff41', '0 0 7px #00ff41'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            {'<SR/>'}
                        </motion.div>
                        <p className="text-neon-green/60 font-mono text-sm tracking-widest uppercase">
                            Cybersecurity Portfolio
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-72 mx-auto">
                        <div className="h-1 bg-cyber-gray rounded-full overflow-hidden mb-3">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #00ff41, #00d4ff)',
                                    width: `${progress}%`,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neon-green/60 font-mono text-xs">{statusText}</span>
                            <span className="text-neon-green font-mono text-xs">{Math.round(progress)}%</span>
                        </div>
                    </div>

                    {/* Blinking cursor */}
                    <motion.div
                        className="mt-6 font-mono text-neon-green text-sm"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    >
                        █
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
