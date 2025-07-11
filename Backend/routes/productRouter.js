import express from "express";
import Authenticated from "../middlewares/jwtAuth.js";
import product from "../models/product.js";
import rating from "../models/rating.js";

const router = express.Router();

router.get("/all", Authenticated, async (req, res) => {
  try {
    const products = await product.find().populate("vendor");
    res.status(200).json({ success: true, products });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/", Authenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await product.countDocuments();
    const products = await product
      .find()
      .populate("vendor", "CompanyName")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/:id", Authenticated, async (req, res) => {
  try {
    const Product = await product
      .findById(req.params.id)
      .populate("vendor", "CompanyName");
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, Product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/featured/featured-products", async (req, res) => {
  try {
    const featuredProducts = await product.find({ isFeatured: true });

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    res.json({ products: featuredProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({ message: "Only vendors can add products" });
    }

    const {
      productname,
      description,
      price,
      formula,
      type,
      keywords,
      image,
      quantity,
      FeaturedRequest,
    } = req.body;

    const newProduct = new product({
      productname,
      vendor: req.user._id,
      description,
      price,
      formula,
      type,
      isFeatured: false,
      FeaturedRequest: FeaturedRequest || "None",
      keywords,
      image,
      quantity,
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (e) {
    console.error("Error adding product:", e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.delete("/:id", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Only vendors can delete products" });
    }

    const Product = await product.findById(req.params.id);
    if (!Product) return res.status(404).json({ message: "Product not found" });

    if (Product.vendor.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this product" });
    }

    await product.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Only vendors can Update the products",
      });
    }
    const Product = await product.findById(req.params.id);
    if (!Product)
      return res.status(404).json({ message: "Product does not exist" });

    if (Product.vendor.toString() !== req.user._id) {
      return res.status(403).json("Unauthorized to update this product");
    }

    const updatedFields = [
      "productname",
      "description",
      "price",
      "formula",
      "type",
      "keywords",
      "image",
      "quantity",
    ];
    const updateData = {};

    updatedFields.forEach((field) => {
      if (field in req.body) {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
      }
    });

    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/search/:key", Authenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        { productname: { $regex: req.params.key, $options: "i" } },
        { description: { $regex: req.params.key, $options: "i" } },
        { keywords: { $regex: req.params.key, $options: "i" } },
      ],
    };

    const [products, total] = await Promise.all([
      product
        .find(query)
        .populate("vendor", "CompanyName")
        .skip(skip)
        .limit(limit),
      product.countDocuments(query),
    ]);

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No Relevant Products available",
        products: [],
        pagination: {
          total: 0,
          page,
          pages: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Search Results",
      products,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/search-all/:key", Authenticated, async (req, res) => {
  try {
    const query = {
      $or: [
        { productname: { $regex: req.params.key, $options: "i" } },
        { description: { $regex: req.params.key, $options: "i" } },
        { keywords: { $regex: req.params.key, $options: "i" } },
      ],
    };

    const products = await product
      .find(query)
      .populate("vendor", "CompanyName");

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No Relevant Products available",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Search Results",
      products,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.get("/request-feature/:id", Authenticated, async (req, res) => {
  try {
    const Product = await product.findById(req.params.id);

    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (Product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to request feature for this product",
      });
    }

    if (Product.FeaturedRequest === "Pending") {
      return res
        .status(400)
        .json({ message: "Feature request already pending" });
    }
    if (Product.FeaturedRequest === "Approved") {
      return res.status(400).json({ message: "Product is already featured" });
    }

    Product.FeaturedRequest = "Pending";
    await Product.save();

    res.status(200).json({
      message:
        "Feature request submitted successfully and is pending admin approval",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/:id/ratings", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can add ratings" });
    }

    const checkRating = await rating.findOne({
      user: req.user._id,
      product: req.params.id,
    });

    if (checkRating) {
      return res
        .status(400)
        .json({ message: "You have already rated this product" });
    }

    const Product = await product.findById(req.params.id);
    if (!Product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const { Rating, comment } = req.body;
    if (!Rating || Rating < 1 || Rating > 5) {
      return res.status(400).json({ message: "Invalid rating value" });
    }
    const newRating = new rating({
      rating: Rating,
      comment: comment,
      user: req.user._id,
      product: Product._id,
    });
    await newRating.save();

    res.status(201).json({
      success: true,
      message: "Rating added successfully",
      rating: newRating,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.put("/:id/ratings", Authenticated, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can update ratings" });
    }
    const { Rating, comment } = req.body;
    const ratingToUpdate = await rating.findOne({
      user: req.user._id,
      product: req.params.id,
    });
    if (!ratingToUpdate) {
      return res.status(404).json({ message: "Rating not found" });
    }

    ratingToUpdate.rating = Rating || ratingToUpdate.rating;
    ratingToUpdate.comment = comment || ratingToUpdate.comment;
    await ratingToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      rating: ratingToUpdate,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/:id/ratings", Authenticated, async (req, res) => {
  try {
    const Rating = await rating
      .find({ product: req.params.id })
      .populate("user", "name");
    let totalRating = 0;

    if (!Rating || Rating.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings found for this product" });
    }

    Rating.forEach((ratings) => {
      totalRating += ratings.rating;
    });
    totalRating = totalRating / Rating.length;

    res.status(200).json({
      success: true,
      message: "Ratings retrieved successfully",
      ratings: totalRating,
      allratings: Rating,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/:id/ratings/user", Authenticated, async (req, res) => {
  try {
    const userRating = await rating
      .findOne({
        user: req.user._id,
        product: req.params.id,
      })
      .populate("user", "name");

    if (!userRating) {
      return res.status(404).json({ message: "User rating not found" });
    }

    res.status(200).json({
      success: true,
      message: "User rating retrieved successfully",
      rating: userRating,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
