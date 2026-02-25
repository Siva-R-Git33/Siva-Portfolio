import { createClient } from '@supabase/supabase-js';

const originalSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || '';

if (!originalSupabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Check your .env file.");
}

// Universal Adblocker / Firewall Bypass Proxy
// Mask all backend database traffic as first-party requests.
// Vite dev server proxies this locally. Vercel Edge proxies it in production.
const getProxyUrl = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin + '/api/supabase';
    }
    return originalSupabaseUrl;
};

export const supabase = createClient(getProxyUrl(), supabaseAnonKey);
