import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaQrcode, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import { authAPI } from '../utils/api';

export default function ManageSecurity() {
    const [status, setStatus] = useState('loading'); // 'loading', 'disabled', 'enrolling', 'enabled'
    const [factors, setFactors] = useState([]);
    const [enrollData, setEnrollData] = useState(null);
    const [verifyCode, setVerifyCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const res = await authAPI.getUserFactors();
            setFactors(res.data);
            if (res.data.length > 0) {
                setStatus('enabled');
            } else {
                setStatus('disabled');
            }
        } catch (err) {
            setError('Failed to load security settings.');
            setStatus('disabled');
        }
    };

    const handleEnroll = async () => {
        setError('');
        setStatus('loading');
        try {
            const res = await authAPI.mfaEnroll();
            setEnrollData(res.data);
            setStatus('enrolling');
        } catch (err) {
            setError(err.message || 'Failed to start enrollment.');
            setStatus('disabled'); // Prevent UI lockup
        }
    };

    const handleVerify = async () => {
        setError('');
        setSuccess('');
        try {
            // First hit the challenge endpoint to get a challenge ID for this specific code attempt
            const challengeRes = await authAPI.mfaChallenge(enrollData.id);
            // Then verify the user's 6-digit code against the challenge ID
            await authAPI.mfaVerify(enrollData.id, challengeRes.data.id, verifyCode);

            setSuccess('Two-Factor Authentication successfully enabled!');
            setVerifyCode('');
            setEnrollData(null);
            checkStatus(); // will switch back to 'enabled'
        } catch (err) {
            setError(err.message || 'Verification failed. Invalid code.');
        }
    };

    const handleDisable = async () => {
        if (!window.confirm("Are you sure you want to disable 2FA? This will reduce the security of your admin panel.")) return;

        setError('');
        setSuccess('');
        try {
            // Un-enroll all active TOTP factors
            for (const factor of factors) {
                await authAPI.mfaUnenroll(factor.id);
            }
            setSuccess('Two-Factor Authentication disabled.');
            checkStatus();
        } catch (err) {
            setError(err.message || 'Failed to disable 2FA.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-cyber-dark/50 p-6 rounded-xl border border-cyber-border/30">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <FaShieldAlt className="text-neon-blue" />
                        Admin Security
                    </h1>
                    <p className="text-gray-400 font-mono text-sm max-w-xl">
                        Manage Two-Factor Authentication (2FA) via Authenticator Apps (TOTP) to secure your portfolio.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-neon-red/10 border border-neon-red/30 text-neon-red p-4 rounded-lg font-mono text-sm">
                    ⚠️ {error}
                </div>
            )}
            {success && (
                <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green p-4 rounded-lg font-mono text-sm">
                    ✅ {success}
                </div>
            )}

            <div className="cyber-card">
                <h2 className="text-xl font-bold text-neon-blue mb-4 border-b border-cyber-border/50 pb-2">Multi-Factor Authentication</h2>

                {status === 'loading' && <p className="text-gray-500 font-mono animate-pulse">Checking security status...</p>}

                {status === 'enabled' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-neon-green/5 border border-neon-green/20 rounded-lg">
                            <FaCheckCircle className="text-neon-green text-2xl" />
                            <div>
                                <h3 className="text-white font-bold">2FA is currently ACTIVE</h3>
                                <p className="text-gray-400 text-sm">Your admin account is protected by an Authenticator App.</p>
                            </div>
                        </div>
                        <button onClick={handleDisable} className="cyber-btn-solid !bg-neon-red/20 !text-neon-red !border-neon-red/50 hover:!bg-neon-red/30">
                            Disable 2FA
                        </button>
                    </motion.div>
                )}

                {status === 'disabled' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                            <FaExclamationTriangle className="text-yellow-500 text-2xl" />
                            <div>
                                <h3 className="text-white font-bold">2FA is NOT ACTIVE</h3>
                                <p className="text-gray-400 text-sm">Enable Two-Factor Authentication to drastically increase admin security.</p>
                            </div>
                        </div>
                        <button onClick={handleEnroll} className="cyber-btn-solid flex items-center gap-2">
                            <FaQrcode /> Setup Authenticator App
                        </button>
                    </motion.div>
                )}

                {status === 'enrolling' && enrollData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="p-6 bg-cyber-dark/80 rounded-xl border border-cyber-border text-center flex flex-col items-center">
                            <h3 className="text-white font-bold mb-4">Step 1: Scan QR Code</h3>
                            <p className="text-gray-400 text-sm mb-6 max-w-sm">
                                Open Google Authenticator, Authy, or your preferred TOTP app and scan this QR code.
                            </p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-6">
                                <QRCodeSVG
                                    value={enrollData.totp.uri.replace(/issuer=[^&]+/, 'issuer=Siva%20Portfolio').replace(/totp\/[^:]+/, 'totp/Siva%20Portfolio')}
                                    size={200}
                                />
                            </div>

                            <div className="w-full max-w-sm text-left">
                                <h3 className="text-white font-bold mb-2 text-center">Step 2: Verify Setup</h3>
                                <label className="block text-gray-400 text-sm mb-1 font-mono text-center">Enter 6-digit code generated by the app:</label>
                                <input
                                    type="text"
                                    maxLength="6"
                                    value={verifyCode}
                                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full text-center tracking-[1em] font-mono text-2xl bg-cyber-gray border border-cyber-border rounded-lg py-3 text-white focus:border-neon-green focus:outline-none transition-all mb-4"
                                    placeholder="000000"
                                />
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { setStatus('disabled'); setEnrollData(null); }}
                                        className="w-1/3 cyber-btn hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleVerify}
                                        disabled={verifyCode.length !== 6}
                                        className="w-2/3 cyber-btn-solid disabled:opacity-50"
                                    >
                                        Verify & Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
