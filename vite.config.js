import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        root: '.',
        envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
        build: {
            minify: false,
            rollupOptions: {
                output: {
                }
            }
        },
        server: {
            port: 5173,
            host: '0.0.0.0',
            proxy: {
                '/api/supabase': {
                    target: env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/supabase/, ''),
                    secure: false
                }
            }
        },
    };
});
