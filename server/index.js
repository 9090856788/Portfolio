import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
import { errorMiddleware } from "./middleware/error.js";
import messageRouter from "./router/messageRoutes.js";
import userRouter from "./router/userRoutes.js";

// configure enviromental variable
dotenv.config({ path: "./config/.env" });
const PORT = process.env.PORT || 3000;

// Configure Packages Section
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true, // Use temporary files instead of storing in memory
    tempFileDir: "/tmp/", // Specify the directory for temporary files
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB file size limit
  })
);

// routes configuration
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use(
  cors({
    origin: [process.env.ADMIN_DASHBOARD_URL, process.env.PORTFOLIO_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
dbConnection();
app.use(errorMiddleware);

// cloudinary Configurations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server running the PORT: ${PORT} :)`);
});
