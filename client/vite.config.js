/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import http from 'http'
import net from 'net'
import { fileURLToPath } from 'url'
import app from '../server/app.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Check if a local port is actively listening
function checkPortActive(port, host = '127.0.0.1', timeout = 120) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    socket.setTimeout(timeout)
    socket.on('connect', () => {
      socket.destroy()
      resolve(true)
    })
    socket.on('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.on('error', () => {
      socket.destroy()
      resolve(false)
    })
    socket.connect(port, host)
  })
}

let backendStatus = null
let lastBackendCheck = 0
async function isBackendOnline(port) {
  const now = Date.now()
  if (backendStatus !== null && now - lastBackendCheck < 2000) {
    return backendStatus
  }
  backendStatus = await checkPortActive(port)
  lastBackendCheck = now
  return backendStatus
}

let adminStatus = null
let lastAdminCheck = 0
async function isAdminOnline(port = 5173) {
  const now = Date.now()
  if (adminStatus !== null && now - lastAdminCheck < 2000) {
    return adminStatus
  }
  adminStatus = await checkPortActive(port)
  lastAdminCheck = now
  return adminStatus
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'express-backend-and-admin-gateway',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // 1. API Route handling (Forward to standalone backend on port 4000 if running, else internal app)
          if (req.url && req.url.startsWith('/api')) {
            const targetBackendPort = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT, 10) : 4000
            const externalBackendUp = await isBackendOnline(targetBackendPort)

            if (externalBackendUp) {
              const options = {
                hostname: '127.0.0.1',
                port: targetBackendPort,
                path: req.url,
                method: req.method,
                headers: {
                  ...req.headers,
                  host: `127.0.0.1:${targetBackendPort}`,
                },
              }

              const proxyReq = http.request(options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers)
                proxyRes.pipe(res, { end: true })
              })

              proxyReq.on('error', () => {
                return app(req, res, next)
              })

              req.pipe(proxyReq, { end: true })
              return
            }

            return app(req, res, next)
          }

          // 2. Admin Route handling (/admin)
          if (req.url && req.url.startsWith('/admin')) {
            const adminPort = 5173
            const adminDevActive = await isAdminOnline(adminPort)

            // If Admin dev server is running on port 5173, live-proxy all /admin traffic to it
            if (adminDevActive) {
              const options = {
                hostname: '127.0.0.1',
                port: adminPort,
                path: req.url,
                method: req.method,
                headers: {
                  ...req.headers,
                  host: `127.0.0.1:${adminPort}`,
                },
              }

              const proxyReq = http.request(options, (proxyRes) => {
                res.writeHead(proxyRes.statusCode, proxyRes.headers)
                proxyRes.pipe(res, { end: true })
              })

              proxyReq.on('error', () => {
                // fall through to static dist/admin if proxy fails
              })

              req.pipe(proxyReq, { end: true })
              return
            }

            // Fallback to static dist/admin build
            const adminDistPath = path.resolve(__dirname, '../dist/admin')
            const cleanUrl = req.url.replace(/^\/admin/, '') || '/'
            const pathname = cleanUrl.split('?')[0]
            const filePath = path.join(adminDistPath, pathname === '/' ? 'index.html' : pathname)
            
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              if (filePath.endsWith('.html')) res.setHeader('Content-Type', 'text/html')
              else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript')
              else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css')
              else if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml')
              else if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png')
              else if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json')
              return fs.createReadStream(filePath).pipe(res)
            } else {
              // SPA Fallback to /admin/index.html
              const adminIndex = path.join(adminDistPath, 'index.html')
              if (fs.existsSync(adminIndex)) {
                res.setHeader('Content-Type', 'text/html')
                return fs.createReadStream(adminIndex).pipe(res)
              }
            }

            // If neither live dev server on 5173 nor dist/admin exists, show informative page instead of blank client screen
            res.setHeader('Content-Type', 'text/html')
            return res.end(`
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="utf-8" />
                  <title>Admin Dashboard Setup</title>
                  <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
                    .card { background: #151d2f; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; max-width: 520px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                    h2 { color: #38bdf8; margin-top: 0; font-size: 20px; }
                    p { color: #94a3b8; line-height: 1.6; font-size: 14px; }
                    code { background: #1e293b; color: #a5f3fc; padding: 3px 6px; border-radius: 4px; font-size: 13px; }
                    .step { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px; margin: 12px 0; }
                    a { color: #38bdf8; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                  </style>
                </head>
                <body>
                  <div class="card">
                    <h2>⚙️ Admin Dashboard Startup</h2>
                    <p>The Admin Dashboard can run in live development mode or from compiled static files:</p>
                    <div class="step">
                      <strong>Option 1: Live Hot-Reloading Dev Mode (Port 5173)</strong><br />
                      Run <code>npm run admin</code> in your terminal.<br />
                      Then open <a href="http://localhost:5173/admin/">http://localhost:5173/admin/</a>
                    </div>
                    <div class="step">
                      <strong>Option 2: Run Everything Together</strong><br />
                      Run <code>npm run dev:both</code> in your terminal.
                    </div>
                    <div class="step">
                      <strong>Option 3: Compile Static Admin Assets</strong><br />
                      Run <code>npm run build:admin</code> in your terminal, then refresh this page.
                    </div>
                  </div>
                </body>
              </html>
            `)
          }
          next()
        })
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
