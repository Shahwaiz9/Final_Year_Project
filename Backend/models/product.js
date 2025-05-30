import mongoose from "mongoose";

let productSchema = mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendors",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  formula: {
    type: String,
    required: true,
    default: "NaN",
  },
  type: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    required: true,
    default: false,
  },
  FeaturedRequest: {
    type: String,
    enum: ["None", "Pending", "Approved", "Waiting", "Rejected"],
    default: "None",
  },
  keywords: {
    type: Array,
  },
  image: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

let product = mongoose.model("products", productSchema);

export default product;
