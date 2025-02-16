import mongoose from "mongoose";

const vendorSchema = mongoose.Schema({
  CompanyName: {
    type: String,
    required: true,
  },
  CompanyAddress: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  contact: {
    type: String,
    required: true,
    match: /^03[0-9]{8}$/,
  },
  role: {
    type: String,
    default: "vendor",
  },
});

const vendor = mongoose.model("vendors", vendorSchema);

export default vendor;
