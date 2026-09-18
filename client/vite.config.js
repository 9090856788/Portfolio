import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import app from '../server/app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-backend-and-admin-gateway',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            return app(req, res, next);
          }
          if (req.url && req.url.startsWith('/admin')) {
            const adminDistPath = path.resolve(__dirname, '../dist/admin');
            const cleanUrl = req.url.replace(/^\/admin/, '') || '/';
            // Strip query string if present
            const pathname = cleanUrl.split('?')[0];
            const filePath = path.join(adminDistPath, pathname === '/' ? 'index.html' : pathname);
            
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html');
              else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
              else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
              else if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
              else if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
              else if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json');
              return fs.createReadStream(filePath).pipe(res);
            } else {
              // SPA Fallback to /admin/index.html
              const adminIndex = path.join(adminDistPath, 'index.html');
              if (fs.existsSync(adminIndex)) {
                res.setHeader('Content-Type', 'text/html');
                return fs.createReadStream(adminIndex).pipe(res);
              }
            }
          }
          next();
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: false,
  },
})
