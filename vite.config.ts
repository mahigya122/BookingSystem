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
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
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
        ws: true,
      },
    },
  },
})
