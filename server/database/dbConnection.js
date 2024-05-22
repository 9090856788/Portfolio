import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Database Connected to Successfully :)`);
    })
    .catch((err) => {
      console.log(
        `Error occurred while connecting to MongoDB Database : ${err}`
      );
    });
};
export default dbConnection;
