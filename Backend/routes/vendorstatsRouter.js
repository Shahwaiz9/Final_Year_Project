import express from "express";
import Authenticated from "../middlewares/jwtAuth.js";
import VendorStats from "../models/vendorstats.js";
import Product from "../models/product.js";

const router = express.Router();

router.get("/", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const stats = await VendorStats.findOne({ vendor: req.user._id });
    if (!stats) {
      return res.status(404).json({ message: "Statistics not found" });
    }

    res.status(200).json({ success: true, stats });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
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

export default router;
