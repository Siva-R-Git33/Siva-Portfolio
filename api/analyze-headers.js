export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    const url = new URL(req.url);
    const target = url.searchParams.get('url');

    if (!target) {
        return new Response(
            JSON.stringify({ ok: false, error: 'Missing required ?url= query parameter.' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Basic URL validation
    let parsedTarget;
    try {
        parsedTarget = new URL(target);
        if (!['http:', 'https:'].includes(parsedTarget.protocol)) {
            throw new Error('Only HTTP/HTTPS URLs are supported.');
        }
    } catch (e) {
        return new Response(
            JSON.stringify({ ok: false, error: `Invalid URL: ${e.message}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const response = await fetch(parsedTarget.href, {
            method: 'HEAD',
            redirect: 'follow',
            // Set a reasonable timeout for edge functions
            signal: AbortSignal.timeout(8000),
        });

        const headers = {};
        response.headers.forEach((value, key) => {
            headers[key.toLowerCase()] = value;
        });

        return new Response(
            JSON.stringify({
                ok: true,
                url: parsedTarget.href,
                status: response.status,
                statusText: response.statusText,
                headers,
                raw: JSON.stringify(headers, null, 2),
            }),
            { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
    } catch (err) {
        const msg = err.name === 'TimeoutError'
            ? 'Request timed out. The target server may be unreachable.'
            : err.message || 'An unexpected error occurred while fetching the target URL.';

        return new Response(
            JSON.stringify({ ok: false, error: msg }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
