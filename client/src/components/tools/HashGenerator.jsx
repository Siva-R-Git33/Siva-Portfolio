import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaCopy, FaCheck } from 'react-icons/fa';

// --- Pure client-side hashing via Web Crypto API (no server needed) ---

const HASH_LABELS = {
    'MD5': { color: 'text-neon-red', note: '(insecure, legacy)' },
    'SHA-1': { color: 'text-yellow-400', note: '(deprecated)' },
    'SHA-256': { color: 'text-neon-green', note: '(recommended)' },
    'SHA-512': { color: 'text-neon-blue', note: '(strongest)' },
};

// Web Crypto API helper
async function subtleHash(algorithm, text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Pure-JS MD5 implementation (RFC 1321)
function md5(input) {
    function safeAdd(x, y) { const lsw = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (lsw >> 16)) << 16) | (lsw & 0xffff); }
    function bitRotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
    function md5cmn(q, a, b, x, s, t) { return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
    function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
    function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
    function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

    const str8 = new TextEncoder().encode(input);
    const len8 = str8.length;
    const nblks = ((len8 + 8) >> 6) + 1;
    const blks = new Array(nblks * 16).fill(0);
    for (let i = 0; i < len8; i++) blks[i >> 2] |= str8[i] << ((i % 4) * 8);
    blks[len8 >> 2] |= 0x80 << ((len8 % 4) * 8);
    blks[nblks * 16 - 2] = len8 * 8;

    let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
    for (let i = 0; i < blks.length; i += 16) {
        const [oa, ob, oc, od] = [a, b, c, d];
        a = md5ff(a,b,c,d,blks[i],7,-680876936); d=md5ff(d,a,b,c,blks[i+1],12,-389564586); c=md5ff(c,d,a,b,blks[i+2],17,606105819); b=md5ff(b,c,d,a,blks[i+3],22,-1044525330);
        a=md5ff(a,b,c,d,blks[i+4],7,-176418897); d=md5ff(d,a,b,c,blks[i+5],12,1200080426); c=md5ff(c,d,a,b,blks[i+6],17,-1473231341); b=md5ff(b,c,d,a,blks[i+7],22,-45705983);
        a=md5ff(a,b,c,d,blks[i+8],7,1770035416); d=md5ff(d,a,b,c,blks[i+9],12,-1958414417); c=md5ff(c,d,a,b,blks[i+10],17,-42063); b=md5ff(b,c,d,a,blks[i+11],22,-1990404162);
        a=md5ff(a,b,c,d,blks[i+12],7,1804603682); d=md5ff(d,a,b,c,blks[i+13],12,-40341101); c=md5ff(c,d,a,b,blks[i+14],17,-1502002290); b=md5ff(b,c,d,a,blks[i+15],22,1236535329);
        a=md5gg(a,b,c,d,blks[i+1],5,-165796510); d=md5gg(d,a,b,c,blks[i+6],9,-1069501632); c=md5gg(c,d,a,b,blks[i+11],14,643717713); b=md5gg(b,c,d,a,blks[i],20,-373897302);
        a=md5gg(a,b,c,d,blks[i+5],5,-701558691); d=md5gg(d,a,b,c,blks[i+10],9,38016083); c=md5gg(c,d,a,b,blks[i+15],14,-660478335); b=md5gg(b,c,d,a,blks[i+4],20,-405537848);
        a=md5gg(a,b,c,d,blks[i+9],5,568446438); d=md5gg(d,a,b,c,blks[i+14],9,-1019803690); c=md5gg(c,d,a,b,blks[i+3],14,-187363961); b=md5gg(b,c,d,a,blks[i+8],20,1163531501);
        a=md5gg(a,b,c,d,blks[i+13],5,-1444681467); d=md5gg(d,a,b,c,blks[i+2],9,-51403784); c=md5gg(c,d,a,b,blks[i+7],14,1735328473); b=md5gg(b,c,d,a,blks[i+12],20,-1926607734);
        a=md5hh(a,b,c,d,blks[i+5],4,-378558); d=md5hh(d,a,b,c,blks[i+8],11,-2022574463); c=md5hh(c,d,a,b,blks[i+11],16,1839030562); b=md5hh(b,c,d,a,blks[i+14],23,-35309556);
        a=md5hh(a,b,c,d,blks[i+1],4,-1530992060); d=md5hh(d,a,b,c,blks[i+4],11,1272893353); c=md5hh(c,d,a,b,blks[i+7],16,-155497632); b=md5hh(b,c,d,a,blks[i+10],23,-1094730640);
        a=md5hh(a,b,c,d,blks[i+13],4,681279174); d=md5hh(d,a,b,c,blks[i],11,-358537222); c=md5hh(c,d,a,b,blks[i+3],16,-722521979); b=md5hh(b,c,d,a,blks[i+6],23,76029189);
        a=md5hh(a,b,c,d,blks[i+9],4,-640364487); d=md5hh(d,a,b,c,blks[i+12],11,-421815835); c=md5hh(c,d,a,b,blks[i+15],16,530742520); b=md5hh(b,c,d,a,blks[i+2],23,-995338651);
        a=md5ii(a,b,c,d,blks[i],6,-198630844); d=md5ii(d,a,b,c,blks[i+7],10,1126891415); c=md5ii(c,d,a,b,blks[i+14],15,-1416354905); b=md5ii(b,c,d,a,blks[i+5],21,-57434055);
        a=md5ii(a,b,c,d,blks[i+12],6,1700485571); d=md5ii(d,a,b,c,blks[i+3],10,-1894986606); c=md5ii(c,d,a,b,blks[i+10],15,-1051523); b=md5ii(b,c,d,a,blks[i+1],21,-2054922799);
        a=md5ii(a,b,c,d,blks[i+8],6,1873313359); d=md5ii(d,a,b,c,blks[i+15],10,-30611744); c=md5ii(c,d,a,b,blks[i+6],15,-1560198380); b=md5ii(b,c,d,a,blks[i+13],21,1309151649);
        a=md5ii(a,b,c,d,blks[i+4],6,-145523070); d=md5ii(d,a,b,c,blks[i+11],10,-1120210379); c=md5ii(c,d,a,b,blks[i+2],15,718787259); b=md5ii(b,c,d,a,blks[i+9],21,-343485551);
        a=safeAdd(a,oa); b=safeAdd(b,ob); c=safeAdd(c,oc); d=safeAdd(d,od);
    }
    const toHex = (n) => Array.from({length:4},(_,i) => ((n>>(i*8))&0xff).toString(16).padStart(2,'0')).join('');
    return [a,b,c,d].map(toHex).join('');
}

async function computeAllHashes(text) {
    const [sha1, sha256, sha512] = await Promise.all([
        subtleHash('SHA-1', text),
        subtleHash('SHA-256', text),
        subtleHash('SHA-512', text),
    ]);
    return {
        'MD5': md5(text),
        'SHA-1': sha1,
        'SHA-256': sha256,
        'SHA-512': sha512,
    };
}

export default function HashGenerator() {
    const [text, setText] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState('');

    const handleHash = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        setResults(null);
        try {
            const hashes = await computeAllHashes(text);
            setResults({ input: text, hashes });
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
                Generate MD5, SHA-1, SHA-256, and SHA-512 hashes entirely in your browser — no data leaves your device.
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
                    disabled={loading || !text.trim()}
                    className="cyber-btn-solid px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? <div className="w-4 h-4 border-2 border-cyber-black border-t-transparent rounded-full animate-spin" />
                        : <FaLock />}
                    Compute Hashes
                </button>
            </form>

            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                >
                    <div className="text-sm font-mono text-gray-400 mb-2">
                        Input: <span className="text-white">"{results.input.length > 40 ? results.input.slice(0, 40) + '...' : results.input}"</span>
                    </div>

                    {Object.entries(results.hashes).map(([algo, hash]) => {
                        const meta = HASH_LABELS[algo] || { color: 'text-white', note: '' };
                        return (
                            <div key={algo} className="cyber-card !p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`font-bold font-mono text-sm ${meta.color}`}>{algo}</span>
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
