// import all package & files Section
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./database/dbConnection.js";
import cloudinary from "cloudinary";
import { errorMiddleware } from "./middleware/error.js";
import messageRouter from "./router/messageRoutes.js";

// configure enviromental variable
dotenv.config({ path: "./config/.env" });
const PORT = process.env.PORT || 3000;

// Configure Packages Section
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

// routes configuration
app.use("/api/v1/message", messageRouter);

app.use(
  cors({
    origin: [process.env.ADMIN_DASHBOARD_URL, process.env.PORTFOLIO_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
dbConnection();
app.use(errorMiddleware);

// Cloudinary Configurations
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(PORT, () => {
  console.log(`Server running the PORT: ${PORT} ):`);
});
