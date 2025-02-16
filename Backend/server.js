import express from "express";
import mongoose from "mongoose";

const app = express();

const dbconnect = async () => {
  const connection = await mongoose
    .connect(
      "mongodb+srv://dawood:03348757377d@cluster0.nlusybm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log("Failed to connect to database", err);
    });
};

dbconnect().then(() => {
  app.get("/", (req, res) => {
    res.send("Server is running");
  });

  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});
