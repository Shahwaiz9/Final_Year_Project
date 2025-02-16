import express from "express";
import {
  signupValidation,
  loginValidation,
} from "../middlewares/AuthValidation.js";

const router = express.Router();

router.post("/signup", signupValidation, (req, res) => {
  res.send("signup success");
});

router.post("/login", loginValidation, (req, res) => {
  res.send("login success");
});

export default router;
