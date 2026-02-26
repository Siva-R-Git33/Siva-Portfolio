import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaSpinner, FaCopy, FaCheck } from 'react-icons/fa';

const HASH_LABELS = {
    md5: { name: 'MD5', color: 'text-neon-red', note: '(insecure, legacy)' },
    sha1: { name: 'SHA-1', color: 'text-yellow-400', note: '(deprecated)' },
    sha256: { name: 'SHA-256', color: 'text-neon-green', note: '(recommended)' },
    sha512: { name: 'SHA-512', color: 'text-neon-blue', note: '(strongest)' },
};

export default function HashGenerator() {
    const [text, setText] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState('');

    const handleHash = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const res = await fetch('/api/hash-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Hashing failed');
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (hash, key) => {
        navigator.clipboard.writeText(hash);
        setCopied(key);
        setTimeout(() => setCopied(''), 1500);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Hash Generator</h2>
            <p className="text-gray-400 text-sm font-mono mb-6">
                Generate MD5, SHA-1, SHA-256, and SHA-512 hashes for any text input.
            </p>

            <form onSubmit={handleHash} className="mb-6">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to hash..."
                    rows={4}
                    className="w-full bg-cyber-gray border border-cyber-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neon-green focus:outline-none resize-none mb-3"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="cyber-btn-solid px-6 flex items-center gap-2"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaLock />}
                    Compute Hashes
                </button>
            </form>

            {error && (
                <div className="bg-neon-red/10 border border-neon-red/30 text-neon-red p-4 rounded-lg font-mono text-sm mb-4">
                    ✗ {error}
                </div>
            )}

            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <div className="text-sm font-mono text-gray-400 mb-2">
                        Input: <span className="text-white">"{results.input}"</span>
                    </div>

                    {Object.entries(results.hashes).map(([algo, hash]) => {
                        const meta = HASH_LABELS[algo] || { name: algo, color: 'text-white', note: '' };
                        return (
                            <div key={algo} className="cyber-card !p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`font-bold font-mono text-sm ${meta.color}`}>{meta.name}</span>
                                    <span className="text-xs text-gray-600">{meta.note}</span>
                                </div>
                                <div className="flex items-center justify-between bg-cyber-black/50 px-3 py-2 rounded group">
                                    <code className="text-xs text-gray-300 break-all">{hash}</code>
                                    <button
                                        onClick={() => copyToClipboard(hash, algo)}
                                        className="text-gray-600 hover:text-neon-green transition-colors ml-2 shrink-0"
                                        title="Copy hash"
                                    >
                                        {copied === algo ? <FaCheck className="text-neon-green" /> : <FaCopy />}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            )}
        </div>
    );
}
