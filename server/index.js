import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { app } from "./app.js";
import { errorMiddleware } from "./middleware/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4000;

// Serve Admin SPA at /admin
const adminDistPath = path.resolve(__dirname, "../dist/admin");
app.use("/admin", express.static(adminDistPath));
app.get("/admin*", (req, res, next) => {
  const indexPath = path.join(adminDistPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) next();
  });
});

// Serve Client Portfolio SPA at /
const clientDistPath = path.resolve(__dirname, "../dist/client");
app.use(express.static(clientDistPath));
const rootDistPath = path.resolve(__dirname, "../dist");
app.use(express.static(rootDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  const clientIndex = path.join(clientDistPath, "index.html");
  res.sendFile(clientIndex, (err) => {
    if (err) {
      const rootIndex = path.join(rootDistPath, "index.html");
      res.sendFile(rootIndex, (fallbackErr) => {
        if (fallbackErr) {
          res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <title>Portfolio Backend API Server</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f1f5f9; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
                  .container { max-width: 580px; width: 100%; background: #151d2f; border: 1px solid #1e293b; border-radius: 12px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                  h1 { font-size: 22px; color: #38bdf8; margin: 0 0 8px 0; }
                  p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; }
                  .links { display: flex; flex-direction: column; gap: 10px; }
                  .btn { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #1e293b; color: #f8fafc; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 14px; border: 1px solid #334155; }
                  .btn:hover { background: #283548; color: #38bdf8; border-color: #0284c7; }
                  .badge { font-size: 11px; background: #0369a1; padding: 3px 8px; border-radius: 9999px; color: #fff; font-weight: 600; }
                  .footer-note { margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; line-height: 1.5; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>⚡ Backend API Server (Port ${PORT})</h1>
                  <p>The Express REST API server is actively running and connected to MongoDB.</p>
                  <div class="links">
                    <a class="btn" href="/api/docs" target="_blank">
                      <span>Swagger Interactive API Docs</span>
                      <span class="badge">Docs</span>
                    </a>
                    <a class="btn" href="/api/v1">
                      <span>REST Endpoints Overview (/api/v1)</span>
                      <span class="badge">API</span>
                    </a>
                    <a class="btn" href="/api/health">
                      <span>Server Health Status</span>
                      <span class="badge">Health</span>
                    </a>
                  </div>
                  <div class="footer-note">
                    <strong>Frontend Applications:</strong><br />
                    • Client Portfolio: <a href="http://localhost:3000" style="color:#38bdf8;">http://localhost:3000</a><br />
                    • Admin Dashboard: <a href="http://localhost:5173/admin/" style="color:#38bdf8;">http://localhost:5173/admin/</a> or <a href="http://localhost:3000/admin" style="color:#38bdf8;">http://localhost:3000/admin</a>
                  </div>
                </div>
              </body>
            </html>
          `);
        }
      });
    }
  });
});

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  console.log(`Swagger documentation available at http://0.0.0.0:${PORT}/api/docs`);
});

export default app;
