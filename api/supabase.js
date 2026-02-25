export const config = {
    // Use Vercel's global Edge Network for maximum speed and streaming support without 10s timeouts
    runtime: 'edge',
};

export default async function handler(req) {
    try {
        const url = new URL(req.url);
        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!supabaseUrl) {
            return new Response(JSON.stringify({ error: 'Missing Supabase URL Configuration' }), { status: 500 });
        }

        // The vercel.json rewrite sends /api/supabase/rest/v1/... to /api/supabase
        // We find the path after /api/supabase to append to the real Supabase URL
        const matchString = '/api/supabase';
        const pathIndex = url.pathname.indexOf(matchString);
        let targetPath = '/';

        if (pathIndex !== -1) {
            targetPath = url.pathname.substring(pathIndex + matchString.length);
        }

        // Construct the final destination URL
        const targetUrl = new URL(targetPath, supabaseUrl);
        targetUrl.search = url.search;

        // Clone headers and rewrite the Host to trick Supabase into accepting the request natively
        const proxyHeaders = new Headers(req.headers);
        proxyHeaders.set('Host', new URL(supabaseUrl).host);

        // Remove tracking headers that might trigger adblocker/CORS policies
        proxyHeaders.delete('Origin');
        proxyHeaders.delete('Referer');

        // Forward the request natively via Edge streaming
        const proxyReq = new Request(targetUrl.href, {
            method: req.method,
            headers: proxyHeaders,
            body: (req.method !== 'GET' && req.method !== 'HEAD') ? req.body : undefined,
            redirect: 'manual',
            duplex: 'half' // Required for streaming request bodies in Edge Runtime
        });

        const response = await fetch(proxyReq);

        return response;
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
