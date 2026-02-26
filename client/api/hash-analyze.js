const crypto = require('crypto');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = req.body;

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text input is required' });
    }

    // Limit input length for abuse prevention
    if (text.length > 10000) {
        return res.status(400).json({ error: 'Input too long (max 10,000 characters)' });
    }

    try {
        const hashes = {
            md5: crypto.createHash('md5').update(text).digest('hex'),
            sha1: crypto.createHash('sha1').update(text).digest('hex'),
            sha256: crypto.createHash('sha256').update(text).digest('hex'),
            sha512: crypto.createHash('sha512').update(text).digest('hex'),
        };

        return res.status(200).json({ input: text.substring(0, 50) + (text.length > 50 ? '...' : ''), hashes });
    } catch (error) {
        console.error('Hash Error:', error);
        return res.status(500).json({ error: 'Failed to compute hashes' });
    }
}
