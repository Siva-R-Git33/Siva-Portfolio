const dns = require('dns').promises;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { domain } = req.body;

    if (!domain || typeof domain !== 'string') {
        return res.status(400).json({ error: 'Domain is required' });
    }

    // Clean domain
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

    try {
        const [a, aaaa, mx, txt, ns] = await Promise.allSettled([
            dns.resolve4(cleanDomain),
            dns.resolve6(cleanDomain),
            dns.resolveMx(cleanDomain),
            dns.resolveTxt(cleanDomain),
            dns.resolveNs(cleanDomain)
        ]);

        const records = {
            A: a.status === 'fulfilled' ? a.value : [],
            AAAA: aaaa.status === 'fulfilled' ? aaaa.value : [],
            MX: mx.status === 'fulfilled' ? mx.value : [],
            TXT: txt.status === 'fulfilled' ? txt.value.map(t => t.join('')) : [],
            NS: ns.status === 'fulfilled' ? ns.value : [],
        };

        return res.status(200).json({ domain: cleanDomain, records });
    } catch (error) {
        console.error('DNS Lookup Error:', error);
        return res.status(500).json({ error: 'Failed to resolve DNS records' });
    }
}
