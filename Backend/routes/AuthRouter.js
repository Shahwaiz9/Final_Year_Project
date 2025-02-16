import express from "express";
import {
  signupValidation,
  loginValidation,
} from "../middlewares/AuthValidation.js";
import bcrypt from "bcrypt";
import user from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup/user", signupValidation, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const User = await user.findOne({ email });
    if (User) return res.status(400).json({ message: "Email already exists" });
    const newuser = new user({ name, email, password });
    newuser.password = await bcrypt.hash(password, 10);
    await newuser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    res.status(500).json({ message: "internal server error", success: true });
  }
});

router.post("/login/user", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const User = await user.findOne({ email });

    if (!User) return res.status(403).json({ message: "User doesnt exist" });

    const comparePass = await bcrypt.compare(password, User.password);
    if (!comparePass)
      return res.status(403).json({ message: "Invalid password" });

    const jwtToken = jwt.sign(
      { email: User.email, _id: User._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      jwtToken,
      email,
      name: User.name,
    });
  } catch (e) {
    res.status(500).json({ message: "internal server error", success: true });
  }
});

export default router;
