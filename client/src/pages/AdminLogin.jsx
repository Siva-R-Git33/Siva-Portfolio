import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaUser } from 'react-icons/fa';
import { authAPI } from '../utils/api';
import { setToken } from '../utils/auth';

export default function AdminLogin() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [step, setStep] = useState('login'); // 'login' or 'mfa'
    const [mfaData, setMfaData] = useState({ factorId: '', challengeId: '' });
    const [totpCode, setTotpCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (step === 'login') {
                const res = await authAPI.login(form);
                if (res.data.requireMfa) {
                    // Trigger MFA Challenge
                    const challengeRes = await authAPI.mfaChallenge(res.data.factorId);
                    setMfaData({ factorId: res.data.factorId, challengeId: challengeRes.data.id });
                    setStep('mfa');
                } else {
                    setToken(res.data.token);
                    navigate('/admin/dashboard');
                }
            } else if (step === 'mfa') {
                const res = await authAPI.mfaVerify(mfaData.factorId, mfaData.challengeId, totpCode);
                setToken(res.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 grid-bg">
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Terminal-style login */}
                <div className="terminal-window">
                    <div className="terminal-header">
                        <div className="terminal-dot bg-red-500" />
                        <div className="terminal-dot bg-yellow-500" />
                        <div className="terminal-dot bg-green-500" />
                        <span className="ml-3 text-gray-400 text-xs font-mono">admin@siva-portfolio:~</span>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <motion.div
                                className="w-16 h-16 rounded-2xl bg-neon-green/10 flex items-center justify-center mx-auto mb-4"
                                animate={{ boxShadow: ['0 0 0px rgba(0,255,65,0)', '0 0 20px rgba(0,255,65,0.3)', '0 0 0px rgba(0,255,65,0)'] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FaLock className="text-neon-green text-2xl" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-white mb-1">Admin Access</h1>
                            <p className="text-gray-500 text-sm font-mono">Authentication required</p>
                        </div>

                        {step === 'login' ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Username</label>
                                    <div className="relative">
                                        <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input
                                            type="text"
                                            required
                                            value={form.username}
                                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                                            className="w-full bg-cyber-gray border border-cyber-border rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green/30 transition-all text-sm"
                                            placeholder="admin"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono">Password</label>
                                    <div className="relative">
                                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                        <input
                                            type="password"
                                            required
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="w-full bg-cyber-gray border border-cyber-border rounded-lg pl-10 pr-4 py-3 text-white focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green/30 transition-all text-sm"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="px-4 py-2 rounded-lg bg-neon-red/10 text-neon-red text-sm font-mono border border-neon-red/30"
                                    >
                                        ❌ {error}
                                    </motion.div>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full cyber-btn-solid disabled:opacity-50"
                                >
                                    {loading ? 'Authenticating...' : 'Login'}
                                </motion.button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="text-center mb-6">
                                    <p className="text-neon-green text-sm font-mono animate-pulse">2FA Required. Check your Authenticator App.</p>
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-sm mb-1 font-mono text-center">Enter 6-digit TOTP Code</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength="6"
                                        value={totpCode}
                                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                                        className="w-full text-center tracking-[1em] font-mono text-2xl bg-cyber-gray border border-cyber-border rounded-lg py-4 text-white focus:border-neon-green focus:outline-none focus:ring-1 focus:ring-neon-green/30 transition-all"
                                        placeholder="000000"
                                    />
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="px-4 py-2 rounded-lg bg-neon-red/10 text-neon-red text-sm font-mono border border-neon-red/30 text-center"
                                    >
                                        ❌ {error}
                                    </motion.div>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={loading || totpCode.length !== 6}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full cyber-btn-solid disabled:opacity-50"
                                >
                                    {loading ? 'Verifying...' : 'Verify Code'}
                                </motion.button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <a href="/" className="text-gray-500 text-xs hover:text-neon-green transition-colors">
                                ← Back to Portfolio
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
