import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        root: '.',
        envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
                            if (id.includes('framer-motion')) return 'vendor-motion';
                            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
                            if (id.includes('@supabase')) return 'vendor-supabase';
                            if (id.includes('react-quill') || id.includes('quill')) return 'vendor-quill';
                            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('react-syntax-highlighter')) return 'vendor-markdown';
                            if (id.includes('recharts') || id.includes('d3-') || id.includes('react-is')) return 'vendor-charts';
                        }
                    }
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
