import express from "express";
import Authenticated from "../middlewares/jwtAuth.js";
import Order from "../models/orders.js";
import VendorStats from "../models/vendorstats.js";
import Product from "../models/product.js";

const router = express.Router();

router.post("/place", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can place orders" });
    }

    const {
      vendor,
      product,
      quantity,
      totalAmount,
      address,
      city,
      contactInfo,
      postalCode,
      paymentMethod,
    } = req.body;

    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (productData.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    const newOrder = await Order.create({
      user: req.user._id,
      vendor,
      product,
      quantity,
      totalAmount,
      status: "Pending",
      address,
      city,
      contactInfo,
      postalCode,
      paymentMethod,
    });
    productData.quantity -= quantity;
    await productData.save();

    await VendorStats.findOneAndUpdate(
      { vendor },
      {
        $inc: {
          totalOrders: 1,
          pendingOrders: 1,
          totalSalesAmount: totalAmount,
        },
      },
      { new: true, upsert: true }
    );

    res
      .status(201)
      .json({ success: true, message: "Order placed", order: newOrder });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
});

router.get("/user-orders", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("product")
      .populate("vendor", "CompanyName");

    res.status(200).json({ success: true, orders });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
});

router.get("/vendor-orders", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const orders = await Order.find({ vendor: req.user._id })
      .populate("product")
      .populate("user", "name email");

    res.status(200).json({ success: true, orders });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
});

router.put("/update-status/:orderId", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Only vendors can update order status" });
    }

    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.vendor.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this order" });
    }

    const prevStatus = order.status;
    order.status = status;
    await order.save();

    const updateFields = {};
    if (prevStatus === "Pending" && status !== "Pending")
      updateFields.pendingOrders = -1;
    if (prevStatus !== "Delivered" && status === "Delivered")
      updateFields.completedOrders = 1;

    await VendorStats.findOneAndUpdate(
      { vendor: order.vendor },
      { $inc: updateFields }
    );

    res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: e.message,
    });
  }
});

export default router;
