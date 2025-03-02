import express from "express";
import {
  signupValidation,
  loginValidation,
  vendorLoginValidation,
  vendorSignupValidation,
} from "../middlewares/AuthValidation.js";
import bcrypt from "bcrypt";
import user from "../models/user.js";
import vendor from "../models/vendor.js";
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

    const jwtToken = jwt.sign(
      {
        email: newuser.email,
        _id: newuser._id,
        name: newuser.name,
        role: newuser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      jwtToken,
      email,
      name: newuser.name,
      role: newuser.role,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", success: false });
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
      { email: User.email, _id: User._id, name: User.name, role: User.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      jwtToken,
      email,
      name: User.name,
      role: User.role,
    });
  } catch (e) {
    res.status(500).json({ message: "internal server error", success: true });
  }
});

router.post("/signup/vendor", vendorSignupValidation, async (req, res) => {
  try {
    const { CompanyName, CompanyAddress, email, password, contact } = req.body;
    const Vendor = await vendor.findOne({ email });
    if (Vendor)
      return res.status(400).json({ message: "Email already exists" });

    const newVendor = new vendor({
      CompanyName,
      CompanyAddress,
      email,
      password,
      contact,
    });
    newVendor.password = await bcrypt.hash(password, 10);
    await newVendor.save();

    const jwtToken = jwt.sign(
      {
        email: newVendor.email,
        _id: newVendor._id,
        role: newVendor.role,
        CompanyName: newVendor.CompanyName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      jwtToken,
      email,
      CompanyName: newVendor.CompanyName,
      role: newVendor.role,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

router.post("/login/vendor", vendorLoginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;
    const Vendor = await vendor.findOne({ email });

    if (!Vendor)
      return res.status(403).json({ message: "Vendor doesn't exist" });

    const comparePass = await bcrypt.compare(password, Vendor.password);
    if (!comparePass)
      return res.status(403).json({ message: "Invalid password" });

    const jwtToken = jwt.sign(
      {
        email: Vendor.email,
        _id: Vendor._id,
        role: Vendor.role,
        CompanyName: Vendor.CompanyName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Vendor logged in successfully",
      success: true,
      jwtToken,
      email,
      CompanyName: Vendor.CompanyName,
      role: Vendor.role,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

export default router;
