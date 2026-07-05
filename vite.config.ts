import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  envDir: __dirname,
  plugins: [
    {
      name: 'rewrite-admin',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url?.split('?')[0] || '';

          if (url.startsWith('/admin') && !url.includes('.')) {
            req.url = '/admin.html';
          }
          next();
        });
      }
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Allow imports like '/shared/..' and '@shared/..' to resolve to the client shared folder
      '/shared': resolve(__dirname, 'client/src/shared'),
      '@shared': resolve(__dirname, 'client/src/shared'),
      'shared': resolve(__dirname, 'client/src/shared'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('date-fns') || id.includes('dayjs')) {
              return 'vendor-dates';
            }
            // React core — changes least often, so it caches best on its own
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'vendor-query';
            }
            if (id.includes('react-hot-toast')) {
              return 'vendor-toast';
            }
            // Anything left over after all explicit checks above
            return 'vendor';
          }
        }
      }
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})