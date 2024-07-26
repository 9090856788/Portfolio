import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
import { errorMiddleware } from "./middleware/error.js";
import messageRouter from "./router/messageRoutes.js";
import userRouter from "./router/userRoutes.js";
import timelineRouter from "./router/timelineRoutes.js";
import softwareAppRouter from "./router/softwareApplicationRoutes.js";
import skillRouter from "./router/skillRoutes.js";
import projectRouter from "./router/projectRoutes.js";

// configure environmental variable
dotenv.config();
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
app.use(
    cors({
        origin: [process.env.ADMIN_DASHBOARD_URL, process.env.PORTFOLIO_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });
dbConnection();
app.use(errorMiddleware);

// cloudinary Configurations
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// routes configuration
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/software", softwareAppRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);

app.listen(PORT, () => {
    console.log(`Server running the PORT: ${PORT} :)`);
});
