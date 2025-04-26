import express from "express";
import product from "../models/product.js";
import user from "../models/user.js";
import vendor from "../models/vendor.js";
import VendorStats from "../models/vendorstats.js";

const router = express.Router();

router.get("/product-count", async (req, res) => {
  try {
    const count = await product.countDocuments();

    return res.status(200).json({ success: true, count });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

router.get("/user-count", async (req, res) => {
  try {
    const count = await user.countDocuments();

    return res.status(200).json({ success: true, count });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

router.get("/vendor-count", async (req, res) => {
  try {
    const count = await vendor.countDocuments();

    return res.status(200).json({ success: true, count });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

router.get("/stats-summary", async (req, res) => {
  try {
    const vendorsStats = await VendorStats.find();

    let totalSales = 0;
    let totalOrders = 0;
    let totalPendingOrders = 0;

    vendorsStats.forEach((stats) => {
      totalSales += stats.totalSalesAmount;
      totalOrders += stats.totalOrders;
      totalPendingOrders += stats.pendingOrders;
    });

    return res.status(200).json({
      success: true,
      totalSales,
      totalOrders,
      totalPendingOrders,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: e.message,
    });
  }
});

export default router;
