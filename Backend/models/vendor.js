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
    unique: true,
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
  profilePic: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVNFido6pvUKgR3KB2iGco6cEOFIu7fpun0A&s",
  },
  accountStatus: {
    type: String,
    enum: ["Active", "Suspended"],
    default: "Active",
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
