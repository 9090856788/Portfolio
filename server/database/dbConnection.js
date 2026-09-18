import mongoose from "mongoose";

const dbConnection = () => {
    mongoose.set('bufferCommands', false);
    mongoose
        .connect(process.env.MONGODB_URL || "mongodb://localhost/mock")
        .then(() => {
            console.log(`MongoDB database connected Successfully :)`);
        })
        .catch((err) => {
            console.warn(
                `MongoDB not connected — some features may not work: `,
                err.message
            );
        });
};

export default dbConnection;
