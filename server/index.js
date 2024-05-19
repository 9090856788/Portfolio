// import all package & files Section
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// configure enviromental variable 
dotenv.config({ path: "./config/.env"});
const PORT = process.env.PORT || 3000;

// Configure Packages Section
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/"
}));
app.use(cors({
    origin: [process.env.ADMIN_DASHBOARD_URL, process.env.PORTFOLIO_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server running the PORT: ${PORT} ):`)
});