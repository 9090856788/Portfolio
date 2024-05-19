import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Database Connected Successfully : ):`);
    })
    .catch((err) => {
      console.log(
        `Error occured while Connecting the MongoDB databse : ${err}`
      );
    });
};

export default dbConnection;
