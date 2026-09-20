import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb+srv://appseralabs_db_user:appseralabs@portfolio.ofiupum.mongodb.net/portfolio?retryWrites=true&w=majority";

const dbConnection = () => {
    mongoose.set('bufferCommands', false);
    const mongoUri = process.env.MONGODB_URL || process.env.MONGO_URI || DEFAULT_MONGO_URI;
    
    mongoose
        .connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        })
        .then(() => {
            console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name || 'portfolio'}`);
        })
        .catch((err) => {
            console.warn(
                `[MongoDB] Connection warning (fallback data store active): `,
                err.message
            );
        });
};

export default dbConnection;
