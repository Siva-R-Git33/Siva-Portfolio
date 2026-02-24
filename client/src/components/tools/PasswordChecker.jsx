import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function PasswordChecker() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [crackTime, setCrackTime] = useState('Instant');
    const [feedback, setFeedback] = useState([]);

    const calculateStrength = (pwd) => {
        let score = 0;
        let checks = [];

        if (!pwd) {
            setStrength(0);
            setCrackTime('Instant');
            setFeedback([]);
            return;
        }

        // 1. Length Check
        if (pwd.length > 8) {
            score += 20;
            checks.push({ text: 'More than 8 characters', passed: true });
        } else {
            checks.push({ text: 'More than 8 characters', passed: false });
        }

        if (pwd.length >= 12) score += 10;
        if (pwd.length >= 16) score += 10;

        // 2. Character Variety Checks
        const hasLower = /[a-z]/.test(pwd);
        const hasUpper = /[A-Z]/.test(pwd);
        const hasNumber = /\d/.test(pwd);
        const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

        if (hasLower) {
            score += 15;
            checks.push({ text: 'Lowercase letters', passed: true });
        } else {
            checks.push({ text: 'Lowercase letters', passed: false });
        }

        if (hasUpper) {
            score += 15;
            checks.push({ text: 'Uppercase letters', passed: true });
        } else {
            checks.push({ text: 'Uppercase letters', passed: false });
        }

        if (hasNumber) {
            score += 15;
            checks.push({ text: 'Numbers', passed: true });
        } else {
            checks.push({ text: 'Numbers', passed: false });
        }

        if (hasSymbol) {
            score += 15;
            checks.push({ text: 'Special characters', passed: true });
        } else {
            checks.push({ text: 'Special characters', passed: false });
        }

        // Cap score at 100
        setStrength(Math.min(score, 100));
        setFeedback(checks);

        // Entropy / Crack Time Math Approximation
        // Math: Options^Length / Guesses per second
        let poolSize = 0;
        if (hasLower) poolSize += 26;
        if (hasUpper) poolSize += 26;
        if (hasNumber) poolSize += 10;
        if (hasSymbol) poolSize += 32;

        if (poolSize === 0) {
            setCrackTime('Instant');
            return;
        }

        const entropy = pwd.length * Math.log2(poolSize);
        // Assuming an offline fast attack of 10 billion guesses/sec
        const guessesPerSec = 10000000000;
        const secondsToCrack = Math.pow(2, entropy) / guessesPerSec;

        formatCrackTime(secondsToCrack);
    };

    const formatCrackTime = (seconds) => {
        if (seconds < 1) setCrackTime('Instant');
        else if (seconds < 60) setCrackTime(`${Math.round(seconds)} seconds`);
        else if (seconds < 3600) setCrackTime(`${Math.round(seconds / 60)} minutes`);
        else if (seconds < 86400) setCrackTime(`${Math.round(seconds / 3600)} hours`);
        else if (seconds < 2592000) setCrackTime(`${Math.round(seconds / 86400)} days`);
        else if (seconds < 31536000) setCrackTime(`${Math.round(seconds / 2592000)} months`);
        else if (seconds < 3153600000) setCrackTime(`${Math.round(seconds / 31536000)} years`);
        else setCrackTime('Centuries');
    };

    useEffect(() => {
        calculateStrength(password);
    }, [password]);

    const getStrengthColor = () => {
        if (strength === 0) return 'bg-cyber-gray';
        if (strength < 40) return 'bg-neon-red shadow-[0_0_10px_rgba(255,0,60,0.5)]';
        if (strength < 75) return 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
        return 'bg-neon-green shadow-[0_0_10px_rgba(0,255,65,0.5)]';
    };

    const getStrengthLabel = () => {
        if (strength === 0) return 'None';
        if (strength < 40) return 'Weak';
        if (strength < 75) return 'Moderate';
        return 'Strong';
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white font-mono mb-2">Password Entropy Analyzer</h2>
                <p className="text-gray-400 text-sm">Test the mathematical complexity of a password against brute-force attacks.</p>
            </div>

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a test password..."
                    className="w-full bg-cyber-black border border-cyber-border rounded-lg py-4 pl-4 pr-12 text-white focus:border-neon-green focus:outline-none transition-all font-mono"
                />
                <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            {/* Strength Bar */}
            <div className="space-y-2 relative">
                <div className="flex justify-between text-sm font-mono">
                    <span className="text-gray-400">Strength: <span className={strength >= 75 ? 'text-neon-green' : strength >= 40 ? 'text-yellow-500' : 'text-neon-red'}>{getStrengthLabel()}</span></span>
                    <span className="text-gray-400">{strength}%</span>
                </div>
                <div className="h-2 w-full bg-cyber-black rounded-full overflow-hidden border border-cyber-border/50">
                    <motion.div
                        className={`h-full rounded-full ${getStrengthColor()}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${strength}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Crack Time Estimate */}
            <motion.div
                className="bg-cyber-black border border-cyber-border p-4 rounded-lg flex items-center justify-between"
                animate={{ scale: password.length > 0 ? 1 : 0.98, opacity: password.length > 0 ? 1 : 0.5 }}
            >
                <div className="flex items-center gap-3">
                    <FaClock className="text-neon-purple text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Estimated Offline Crack Time</p>
                        <p className="text-xl font-bold text-white font-mono">{crackTime}</p>
                    </div>
                </div>
            </motion.div>

            {/* Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {feedback.map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-mono ${item.passed ? 'bg-neon-green/5 border-neon-green/30 text-neon-green' : 'bg-cyber-black border-cyber-border text-gray-500'}`}>
                        {item.passed ? <FaCheckCircle /> : <FaTimesCircle />}
                        {item.text}
                    </div>
                ))}
            </div>
        </div>
    );
}
