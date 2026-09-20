import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import dbConnection from "./database/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
import { errorMiddleware } from "./middleware/error.js";
import messageRouter from "./router/messageRoutes.js";
import userRouter from "./router/userRoutes.js";
import timelineRouter from "./router/timelineRoutes.js";
import softwareAppRouter from "./router/softwareApplicationRoutes.js";
import skillRouter from "./router/skillRoutes.js";
import projectRouter from "./router/projectRoutes.js";
import resumeRouter from "./router/resumeRoutes.js";
import { setupSwagger } from "./swagger/swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Setup Swagger UI at /api/docs
setupSwagger(app);

// API Status and Discovery route
app.get(["/api", "/api/v1"], (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio & Admin REST API v1 is active and running",
    endpoints: {
      swaggerDocs: "/api/docs",
      health: "/api/health",
      user: "/api/v1/user",
      project: "/api/v1/project",
      skill: "/api/v1/skill",
      software: "/api/v1/software",
      timeline: "/api/v1/timeline",
      message: "/api/v1/message",
      resume: "/api/v1/resume",
    },
    version: "1.0.0",
  });
});

// REST API Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/software", softwareAppRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);
app.use("/api/v1/resume", resumeRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    docs: "/api/docs",
  });
});

// API 404 handler - ensure all /api requests always return JSON, NEVER HTML!
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Mount Centralized Error Handling Middleware
app.use(errorMiddleware);

// Connect to MongoDB Atlas (if MONGODB_URL is provided, otherwise fallback to DataStore)
dbConnection();

export { app };
export default app;
