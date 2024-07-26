import mongoose from "mongoose";

const dbConnection = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => {
            console.log(`MongoDB database connected Successfully :)`);
        })
        .catch((err) => {
            console.log(
                `There is a error occurs while connecting the MongoDB database: `,
                err
            );
        });
};

export default dbConnection;
