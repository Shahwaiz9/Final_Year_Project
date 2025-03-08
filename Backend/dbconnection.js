import mongoose from "mongoose";

export const dbconnect = async () => {
  await mongoose
    .connect(process.env.DBCONNECT)
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log("Failed to connect to database", err);
    });
};
