import express from "express";
import { Authenticated } from "../middleware/auth.js";
import User from "../models/user.js";

const router = express.Router();

router.put("/edit-info", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can update their profile" });
    }

    const allowedFields = ["name", "email", "profilePic"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field]) updateData[field] = req.body[field];
    });

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, updatedUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
