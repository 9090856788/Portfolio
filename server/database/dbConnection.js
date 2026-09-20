import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_MONGO_URI = "mongodb+srv://appseralabs_db_user:appseralabs@portfolio.ofiupum.mongodb.net/portfolio?retryWrites=true&w=majority";

const dbConnection = () => {
    const mongoUri =
        process.env.MONGODB_URI ||
        process.env.MONGO_URI ||
        process.env.MONGODB_URL ||
        DEFAULT_MONGO_URI;

    mongoose
        .connect(mongoUri, {
            serverSelectionTimeoutMS: 15000,
        })
        .then(() => {
            console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name || 'portfolio'}`);
        })
        .catch((err) => {
            console.warn(
                `[MongoDB] Connection notice: `,
                err.message
            );
        });
};

export default dbConnection;
