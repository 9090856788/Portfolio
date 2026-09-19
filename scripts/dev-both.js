#!/usr/bin/env node
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n=======================================================");
console.log("     Portfolio Workspace: Multi-Process Dev Runner     ");
console.log("=======================================================");
console.log("  • Frontend Client:    http://localhost:3000");
console.log("  • Admin Dashboard:    http://localhost:5173/admin/  (and mirrored on :3000/admin)");
console.log("  • Backend API Server: http://localhost:4000");
console.log("    - API Endpoints:    http://localhost:4000/api/v1");
console.log("    - Swagger UI Docs:  http://localhost:4000/api/docs");
console.log("=======================================================\n");

const isWin = process.platform === "win32";
const npmCmd = isWin ? "npm.cmd" : "npm";

// 1. Launch Backend Server on PORT 4000
const backend = spawn("node", ["server/index.js"], {
  cwd: rootDir,
  env: { ...process.env, PORT: "4000" },
  stdio: ["inherit", "pipe", "pipe"],
});

backend.stdout.on("data", (data) => {
  const lines = data.toString().split("\n");
  lines.forEach((line) => {
    if (line.trim()) console.log(`\x1b[36m[BACKEND:4000]\x1b[0m ${line}`);
  });
});

backend.stderr.on("data", (data) => {
  const lines = data.toString().split("\n");
  lines.forEach((line) => {
    if (line.trim()) console.error(`\x1b[31m[BACKEND:ERR]\x1b[0m ${line}`);
  });
});

// 2. Launch Admin Dashboard on PORT 5173
const admin = spawn(npmCmd, ["run", "dev", "--workspace=admin"], {
  cwd: rootDir,
  env: { ...process.env, VITE_API_URL: "http://127.0.0.1:4000" },
  stdio: ["inherit", "pipe", "pipe"],
});

admin.stdout.on("data", (data) => {
  const lines = data.toString().split("\n");
  lines.forEach((line) => {
    if (line.trim()) console.log(`\x1b[32m[ADMIN:5173]\x1b[0m ${line}`);
  });
});

admin.stderr.on("data", (data) => {
  const lines = data.toString().split("\n");
  lines.forEach((line) => {
    if (line.trim()) console.error(`\x1b[33m[ADMIN:ERR]\x1b[0m ${line}`);
  });
});

// 3. Launch Frontend Client on PORT 3000
const frontend = spawn(npmCmd, ["run", "dev", "--workspace=client"], {
  cwd: rootDir,
  env: { ...process.env, BACKEND_PORT: "4000" },
  stdio: ["inherit", "pipe", "pipe"],
});

frontend.stdout.on("data", (data) => {
  const lines = data.toString().split("\n");
  lines.forEach((line) => {
    if (line.trim()) console.log(`\x1b[35m[CLIENT:3000]\x1b[0m ${line}`);
  });
});

frontend.stderr.on("data", (data) => {
  const lines = data.toString().split("\n");
  lines.forEach((line) => {
    if (line.trim()) console.error(`\x1b[33m[CLIENT:ERR]\x1b[0m ${line}`);
  });
});

function cleanup() {
  console.log("\nShutting down all processes...");
  try { backend.kill("SIGTERM"); } catch (_) {}
  try { admin.kill("SIGTERM"); } catch (_) {}
  try { frontend.kill("SIGTERM"); } catch (_) {}
  process.exit(0);
}

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
