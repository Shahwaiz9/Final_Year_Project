import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import AuthRouter from "./routes/AuthRouter.js";
import productRouter from "./routes/productRouter.js";
import ModelRoute from "./routes/ModelRoute.js";
import dotenv from "dotenv";
import dbconnect from "./dbconnection.js";
import vendorstatsRouter from "./routes/vendorstatsRouter.js";
import orderRouter from "./routes/orderRouter.js";
import vendor from "./routes/vendorRouter.js";
import adminRouter from "./routes/adminRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express();
dotenv.config();

dbconnect().then(() => {
  app.use(bodyParser.json());
  app.use(cors());

  app.use("/auth", AuthRouter);
  app.use("/product", productRouter);
  app.use("/predict", ModelRoute);
  app.use("/vendor-stats", vendorstatsRouter);
  app.use("/orders", orderRouter);
  app.use("/vendor", vendor);
  app.use("/admin", adminRouter);
  app.use("/user", userRouter);

  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
});
