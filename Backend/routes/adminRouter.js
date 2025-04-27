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

router.get("/pending-feature-requests", async (req, res) => {
  try {
    const products = await product
      .find({ FeaturedRequest: "Pending" })
      .populate("vendor", "CompanyName");

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/feature-request/:id", async (req, res) => {
  try {
    const { action } = req.body;

    const Product = await product.findById(req.params.id);

    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (Product.FeaturedRequest !== "Pending") {
      return res
        .status(400)
        .json({ message: "No pending feature request for this product" });
    }

    if (action === "approve") {
      Product.FeaturedRequest = "Approved";
      Product.isFeatured = true;
    } else if (action === "reject") {
      Product.FeaturedRequest = "Rejected";
      Product.isFeatured = false;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action. Must be 'approve' or 'reject'" });
    }

    await Product.save();

    res
      .status(200)
      .json({ message: `Feature request has been ${action}d successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
