import mongoose from "mongoose";

const vendorStatsSchema = mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendors",
      required: true,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
    pendingOrders: {
      type: Number,
      default: 0,
    },
    totalSalesAmount: {
      type: Number,
      default: 0.0,
    },
  },
  { timestamps: true }
);

const VendorStats = mongoose.model("vendorStats", vendorStatsSchema);

export default VendorStats;
