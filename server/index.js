import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { app } from "./app.js";
import { errorMiddleware } from "./middleware/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

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
          res.status(200).send("Portfolio App loading...");
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
