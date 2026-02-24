export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    try {
        let urlObj;
        try {
            urlObj = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // We use a HEAD request to efficiently grab just the headers without downloading the body
        const response = await fetch(urlObj.href, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'Siva-Portfolio-Security-Scanner/1.0'
            },
            redirect: 'follow', // Follow redirects to get final headers
        });

        // We convert the headers iterator to a clean JS object
        const rawHeaders = {};
        for (const [key, value] of response.headers.entries()) {
            rawHeaders[key.toLowerCase()] = value;
        }

        // Core security headers we specifically grade
        const securityHeaders = {
            'strict-transport-security': rawHeaders['strict-transport-security'] || null,
            'content-security-policy': rawHeaders['content-security-policy'] || null,
            'x-frame-options': rawHeaders['x-frame-options'] || null,
            'x-content-type-options': rawHeaders['x-content-type-options'] || null,
            'referrer-policy': rawHeaders['referrer-policy'] || null,
            'permissions-policy': rawHeaders['permissions-policy'] || null
        };

        return res.status(200).json({
            ok: true,
            status: response.status,
            url: response.url, // Final URL after redirects
            headers: securityHeaders,
            raw: rawHeaders
        });

    } catch (error) {
        // Handle common network errors (DNS, timeout, connection refused)
        return res.status(500).json({
            ok: false,
            error: error.message || 'Failed to connect to the target host.'
        });
    }
}
