import mongoose from "mongoose";

let productSchema = mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },
  vendor: {
    type: String,
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
  keywords: {
    type: Array,
  },
  image: {
    type: String,
  },
});

let product = mongoose.model("products", productSchema);

export default product;
