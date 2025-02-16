import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import AuthRouter from "./routes/AuthRouter.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const dbconnect = async () => {
  const connection = await mongoose
    .connect(
      "mongodb+srv://dawood:03348757377d@cluster0.nlusybm.mongodb.net/PlantHaven?retryWrites=true&w=majority&appName=Cluster0"
    )
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log("Failed to connect to database", err);
    });
};

dbconnect().then(() => {
  app.use(bodyParser.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.send("Server is running");
  });

  app.use("/auth", AuthRouter);

  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});
