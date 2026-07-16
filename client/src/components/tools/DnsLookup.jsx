import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaSpinner, FaCopy, FaCheck } from 'react-icons/fa';

// Uses Google DNS-over-HTTPS API — fully client-side, no server function needed
const DOH_API = 'https://dns.google/resolve';
const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS'];

const RECORD_COLORS = {
    A: 'text-neon-green',
    AAAA: 'text-neon-blue',
    MX: 'text-neon-purple',
    TXT: 'text-yellow-400',
    NS: 'text-orange-400',
};

// DNS type numbers for Google DoH
const TYPE_MAP = { A: 1, AAAA: 28, MX: 15, TXT: 16, NS: 2 };

async function resolveType(domain, type) {
    const res = await fetch(`${DOH_API}?name=${encodeURIComponent(domain)}&type=${type}`, {
        headers: { Accept: 'application/dns-json' },
    });
    if (!res.ok) throw new Error(`DoH request failed for type ${type}`);
    const data = await res.json();
    // data.Answer may be undefined if no records
    const answers = data.Answer || [];
    return answers
        .filter((a) => a.type === TYPE_MAP[type])
        .map((a) => {
            if (type === 'MX') {
                // MX data format: "10 mail.example.com."
                const parts = String(a.data).trim().split(/\s+/);
                return { priority: parseInt(parts[0]) || 0, exchange: parts[1]?.replace(/\.$/, '') || '' };
            }
            // Remove trailing dot from NS/CNAME records, strip quotes from TXT
            return String(a.data).replace(/\.$/, '').replace(/^"|"$/g, '');
        });
}

export default function DnsLookup() {
    const [domain, setDomain] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState('');

    const handleLookup = async (e) => {
        e.preventDefault();
        const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//i, '');
        if (!trimmed) return;

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const recordPromises = RECORD_TYPES.map((type) =>
                resolveType(trimmed, type).then((values) => [type, values]).catch(() => [type, []])
            );
            const resolved = await Promise.all(recordPromises);
            const records = Object.fromEntries(resolved);
            setResults({ domain: trimmed, records });
        } catch (err) {
            setError(err.message || 'DNS lookup failed. Check the domain and try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(''), 1500);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">DNS Lookup</h2>
            <p className="text-gray-400 text-sm font-mono mb-6">
                Resolve A, AAAA, MX, TXT, and NS records via Google DNS-over-HTTPS — runs entirely in your browser.
            </p>

            <form onSubmit={handleLookup} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="e.g. example.com"
                    className="flex-1 bg-cyber-gray border border-cyber-border rounded-lg px-4 py-3 text-white font-mono text-sm focus:border-neon-green focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="cyber-btn-solid px-6 flex items-center gap-2"
                >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                    Resolve
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
                    className="space-y-4"
                >
                    <div className="text-sm font-mono text-gray-400 mb-2">
                        Results for <span className="text-neon-green font-bold">{results.domain}</span>
                    </div>

                    {Object.entries(results.records).map(([type, values]) => (
                        <div key={type} className="cyber-card !p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`font-bold font-mono text-sm ${RECORD_COLORS[type] || 'text-white'}`}>{type}</span>
                                <span className="text-xs text-gray-500">({values.length} record{values.length !== 1 ? 's' : ''})</span>
                            </div>
                            {values.length > 0 ? (
                                <div className="space-y-1">
                                    {values.map((val, i) => {
                                        const display = typeof val === 'object'
                                            ? `${val.exchange} (priority: ${val.priority})`
                                            : String(val);
                                        const key = `${type}-${i}`;
                                        return (
                                            <div
                                                key={key}
                                                className="flex items-center justify-between bg-cyber-black/50 px-3 py-2 rounded text-xs font-mono group"
                                            >
                                                <span className="text-gray-300 break-all">{display}</span>
                                                <button
                                                    onClick={() => copyToClipboard(display, key)}
                                                    className="text-gray-600 hover:text-neon-green transition-colors ml-2 shrink-0"
                                                    title="Copy"
                                                >
                                                    {copied === key ? <FaCheck className="text-neon-green" /> : <FaCopy />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-xs font-mono">No records found</p>
                            )}
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
