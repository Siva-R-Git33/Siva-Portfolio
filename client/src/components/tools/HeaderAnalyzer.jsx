import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGlobe, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSearch } from 'react-icons/fa';

export default function HeaderAnalyzer() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const analyzeHeaders = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            // Call the Vercel Serverless proxy to bypass CORS
            const target = encodeURIComponent(url);
            const res = await fetch(`/api/analyze-headers?url=${target}`);
            const data = await res.json();

            if (!data.ok) {
                throw new Error(data.error || 'Failed to analyze headers.');
            }

            calculateScore(data);
        } catch (err) {
            setError(err.message || 'An unexpected error occurred. Target may be unreachable.');
        } finally {
            setLoading(false);
        }
    };

    const calculateScore = (data) => {
        let score = 100;
        const checks = [];
        const headers = data.headers;

        const addCheck = (name, value, deduction, desc, passDesc) => {
            if (value) {
                checks.push({ name, passed: true, desc: passDesc, value });
            } else {
                score -= deduction;
                checks.push({ name, passed: false, desc });
            }
        };

        addCheck(
            'Strict-Transport-Security',
            headers['strict-transport-security'],
            20,
            'Missing. Site is vulnerable to MITM downgrade attacks.',
            'Enforces HTTPS connections.'
        );

        addCheck(
            'Content-Security-Policy',
            headers['content-security-policy'],
            25,
            'Missing. Highly vulnerable to Cross-Site Scripting (XSS).',
            'Restricts resource loading to trusted sources.'
        );

        addCheck(
            'X-Frame-Options',
            headers['x-frame-options'],
            15,
            'Missing. Site can be embedded in an iframe, leading to Clickjacking.',
            'Prevents Clickjacking attacks.'
        );

        addCheck(
            'X-Content-Type-Options',
            headers['x-content-type-options'],
            10,
            'Missing. Browsers may perform MIME-sniffing, leading to XSS.',
            'Prevents MIME-sniffing exploits.'
        );

        addCheck(
            'Referrer-Policy',
            headers['referrer-policy'],
            10,
            'Missing. May leak sensitive URL parameters to third-party sites.',
            'Controls amount of referrer information sent.'
        );

        addCheck(
            'Permissions-Policy',
            headers['permissions-policy'],
            10,
            'Missing. Does not restrict excessive browser API access (camera, mic).',
            'Limits browser features.'
        );

        setResult({
            score: Math.max(0, score),
            checks,
            url: data.url,
            raw: data.raw,
            grade: getGrade(Math.max(0, score))
        });
    };

    const getGrade = (score) => {
        if (score >= 90) return { letter: 'A', color: 'text-neon-green border-neon-green shadow-[0_0_15px_rgba(0,255,65,0.3)]' };
        if (score >= 80) return { letter: 'B', color: 'text-neon-blue border-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.3)]' };
        if (score >= 60) return { letter: 'C', color: 'text-yellow-500 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' };
        if (score >= 40) return { letter: 'D', color: 'text-orange-500 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' };
        return { letter: 'F', color: 'text-neon-red border-neon-red shadow-[0_0_15px_rgba(255,0,60,0.3)]' };
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white font-mono mb-2">HTTP Header Analyzer</h2>
                <p className="text-gray-400 text-sm max-w-xl mx-auto">
                    Inspect a web server's security posture by analyzing its HTTP response headers.
                    Checks for modern defenses against XSS, Clickjacking, and Sniffing.
                </p>
            </div>

            <form onSubmit={analyzeHeaders} className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <FaGlobe className="text-gray-500" />
                </div>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-cyber-black/50 border border-cyber-border rounded-xl py-4 pl-12 pr-32 text-white focus:border-neon-blue focus:outline-none transition-all font-mono"
                    required
                />
                <button
                    type="submit"
                    disabled={loading || !url}
                    className="absolute right-2 top-2 bottom-2 bg-neon-blue hover:bg-neon-blue/80 text-cyber-black font-bold px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-cyber-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <FaSearch /> Scan
                        </>
                    )}
                </button>
            </form>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto p-4 bg-neon-red/10 border border-neon-red/30 text-neon-red rounded-lg text-center font-mono text-sm"
                >
                    <FaExclamationTriangle className="inline mr-2" />
                    {error}
                </motion.div>
            )}

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between bg-cyber-black/50 border border-cyber-border p-6 rounded-xl">
                        <div className="mb-4 md:mb-0 text-center md:text-left">
                            <h3 className="text-xl font-bold text-white font-mono mb-1 text-ellipsis overflow-hidden whitespace-nowrap max-w-[300px] md:max-w-sm" title={result.url}>
                                {result.url}
                            </h3>
                            <p className="text-gray-400 text-sm font-mono">Score: {result.score} / 100</p>
                        </div>
                        <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-4xl font-bold ${result.grade.color} bg-cyber-black`}>
                            {result.grade.letter}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {result.checks.map((check, idx) => (
                            <div key={idx} className={`p-4 rounded-lg border ${check.passed ? 'bg-neon-green/5 border-neon-green/20' : 'bg-neon-red/5 border-neon-red/20'}`}>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {check.passed ? (
                                            <FaCheckCircle className="text-neon-green text-xl" />
                                        ) : (
                                            <FaTimesCircle className="text-neon-red text-xl" />
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h4 className={`font-mono font-bold text-lg ${check.passed ? 'text-neon-green' : 'text-neon-red'}`}>
                                            {check.name}
                                        </h4>
                                        <p className="text-gray-400 text-sm mt-1">{check.desc}</p>
                                        {check.passed && check.value && (
                                            <div className="mt-2 bg-cyber-black p-2 rounded border border-cyber-border/50 text-xs text-gray-300 font-mono break-all">
                                                {check.value}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
