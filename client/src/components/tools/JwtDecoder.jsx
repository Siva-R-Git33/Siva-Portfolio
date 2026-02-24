import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFingerprint, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function JwtDecoder() {
    const [token, setToken] = useState('');
    const [decoded, setDecoded] = useState(null);
    const [error, setError] = useState('');

    const decodeToken = (jwt) => {
        if (!jwt) {
            setDecoded(null);
            setError('');
            return;
        }

        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format. Must contain 3 parts separated by dots.');
            }

            // Decode Base64Url
            const decodeBase64Url = (str) => {
                str = str.replace(/-/g, '+').replace(/_/g, '/');
                while (str.length % 4) {
                    str += '=';
                }
                return JSON.parse(decodeURIComponent(escape(atob(str))));
            };

            const header = decodeBase64Url(parts[0]);
            const payload = decodeBase64Url(parts[1]);

            // Check expiration
            let isExpired = false;
            let timeRemaining = null;
            if (payload.exp) {
                const now = Math.floor(Date.now() / 1000);
                isExpired = now > payload.exp;
                if (!isExpired) {
                    timeRemaining = payload.exp - now;
                }
            }

            setDecoded({
                header,
                payload,
                signature: parts[2],
                isExpired,
                timeRemaining,
                hasExp: !!payload.exp
            });
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to decode token. Please ensure it is a valid Base64 JWT.');
            setDecoded(null);
        }
    };

    useEffect(() => {
        decodeToken(token);
    }, [token]);

    const formatTimeRemaining = (seconds) => {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
        return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono mb-2">JWT Decoder</h2>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                    Inspect the contents of a JSON Web Token entirely client-side. Decodes the Base64Url
                    Header and Payload, and checks token expiration status.
                </p>
            </div>

            <div className="relative">
                <div className="absolute top-4 left-4 pointer-events-none">
                    <FaFingerprint className="text-neon-purple text-xl" />
                </div>
                <textarea
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Paste JWT here (ey...)"
                    className="w-full bg-cyber-black/50 border border-cyber-border rounded-xl py-4 pl-12 pr-4 text-white focus:border-neon-purple focus:outline-none transition-all font-mono text-sm min-h-[120px] max-h-[300px] break-all"
                    spellCheck="false"
                />
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-neon-red/10 border border-neon-red/30 text-neon-red rounded-lg text-center font-mono text-sm flex items-center justify-center gap-2"
                >
                    <FaExclamationTriangle />
                    {error}
                </motion.div>
            )}

            {decoded && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Status Bar */}
                    <div className="flex flex-wrap gap-4">
                        <div className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border font-mono font-bold ${!decoded.hasExp ? 'bg-cyber-gray/50 border-cyber-border text-gray-400' :
                                decoded.isExpired ? 'bg-neon-red/10 border-neon-red/30 text-neon-red' : 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                            }`}>
                            {!decoded.hasExp ? (
                                <><FaExclamationTriangle /> No Expiration (exp) Claim</>
                            ) : decoded.isExpired ? (
                                <><FaTimesCircle /> Token Expired</>
                            ) : (
                                <><FaCheckCircle /> Token Valid</>
                            )}
                        </div>

                        {decoded.hasExp && !decoded.isExpired && (
                            <div className="flex items-center justify-center gap-2 p-4 rounded-xl border bg-neon-blue/10 border-neon-blue/30 text-neon-blue font-mono font-bold px-8">
                                <FaClock />
                                Expires in: {formatTimeRemaining(decoded.timeRemaining)}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Header Box */}
                        <div className="bg-cyber-black/80 border border-cyber-border rounded-xl overflow-hidden flex flex-col">
                            <div className="bg-cyber-gray px-4 py-2 border-b border-cyber-border text-xs font-mono font-bold text-neon-red uppercase tracking-wider">
                                Header (Algorithm & Token Type)
                            </div>
                            <div className="p-4 overflow-auto flex-1">
                                <pre className="text-neon-red font-mono text-sm">
                                    {JSON.stringify(decoded.header, null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* Payload Box */}
                        <div className="bg-cyber-black/80 border border-cyber-border rounded-xl overflow-hidden flex flex-col">
                            <div className="bg-cyber-gray px-4 py-2 border-b border-cyber-border text-xs font-mono font-bold text-neon-purple uppercase tracking-wider">
                                Payload (Data Claims)
                            </div>
                            <div className="p-4 overflow-auto flex-1 max-h-[400px]">
                                <pre className="text-neon-purple font-mono text-sm leading-relaxed">
                                    {JSON.stringify(decoded.payload, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Signature Box */}
                    <div className="bg-cyber-black/80 border border-cyber-border rounded-xl overflow-hidden">
                        <div className="bg-cyber-gray px-4 py-2 border-b border-cyber-border text-xs font-mono font-bold text-neon-blue uppercase tracking-wider">
                            Verify Signature
                        </div>
                        <div className="p-4 overflow-auto">
                            <p className="text-neon-blue font-mono text-xs break-all opacity-70">
                                {decoded.signature}
                            </p>
                            <p className="text-gray-500 font-mono text-xs mt-2 mt-4 pt-4 border-t border-cyber-border/50">
                                Note: Signature verification requires the private server secret and cannot be done client-side alone.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
