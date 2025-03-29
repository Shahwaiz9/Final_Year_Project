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
    match: /^03[0-9]{9}$/,
  },
  role: {
    type: String,
    default: "vendor",
  },
});

const vendor = mongoose.model("vendors", vendorSchema);

vendorSchema.post("save", async function (doc, next) {
  try {
    await VendorStats.create({ vendor: doc._id });
    next();
  } catch (error) {
    next(error);
  }
});

export default vendor;
