import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import AuthRouter from "./routes/AuthRouter.js";
import productRouter from "./routes/productRouter.js";
import ModelRoute from "./routes/ModelRoute.js";
import dotenv from "dotenv";
import mongoose from "mongoose";



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

  app.use("/auth", AuthRouter);
  app.use("/product", productRouter);
  app.use("/predict", ModelRoute);
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});


