import express from "express";
import Authenticated from "../middlewares/jwtAuth.js";
import Product from "../models/product.js";
import vendor from "../models/vendor.js";

const router = express.Router();

router.get("/profile-info", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Only vendors can acess vendor information" });
    }

    const vendorInfo = await vendor.find({ _id: req.user._id });

    return res.status(200).json({ success: true, vendorInfo });
  } catch (e) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

router.get("/my-products", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Only vendors can access this route" });
    }

    const products = await Product.find({ vendor: req.user._id });
    res.status(200).json({ success: true, products });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/update", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Only vendors can update profile" });
    }

    const allowedFields = ["CompanyName", "CompanyAddress", "email", "contact"];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field]) updateData[field] = req.body[field];
    });

    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Profile updated",
      vendor: updatedVendor,
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
