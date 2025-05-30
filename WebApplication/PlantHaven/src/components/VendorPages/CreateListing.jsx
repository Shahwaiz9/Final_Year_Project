import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CreateListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    productname: "",
    description: "",
    price: "",
    formula: "NaN",
    type: "",
    FeaturedRequest: "None",
    keywords: "",
    image: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const authToken = localStorage.getItem("authToken");
          const response = await fetch(`http://localhost:5000/product/${id}`, {
            headers: {
              Authorization: `${authToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }

          const resData = await response.json();
          const data = resData.Product;

          setFormData({
            productname: data.productname,
            description: data.description,
            price: data.price.toString(),
            formula: data.formula,
            type: data.type,
            FeaturedRequest: data.FeaturedRequest || "None",
            keywords: data.keywords?.join(", ") || "",
            image: data.image,
            quantity: data.quantity.toString(),
          });

          if (data.image) {
            setImagePreview(data.image);
          }

          setIsEditing(true);
        } catch (error) {
          setMessage(error.message);
          console.log(error);
          navigate("/vendor-homepage");
        }
      };

      fetchProduct();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "isFeatured") {
      setFormData((prev) => ({
        ...prev,
        FeaturedRequest: checked ? "Pending" : "None",
      }));
      return;
    }

    if (name === "imageFile" && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || user.role !== "vendor") {
        throw new Error("Only vendors can manage listings");
      }

      // Image validation (only required for new products)
      if (!isEditing && !imageFile) {
        throw new Error("Please upload a product image");
      }

      let imageUrl = formData.image;

      // Upload new image if one was selected
      if (imageFile) {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "default_cloud_name"
        }/upload`;
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", imageFile);
        cloudinaryFormData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "default_preset"
        );

        const uploadResponse = await fetch(cloudinaryUrl, {
          method: "POST",
          body: cloudinaryFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Image upload failed");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.secure_url;
      }

      // Prepare product data (without FeaturedRequest for edits)
      const productData = {
        ...formData,
        image: imageUrl,
        price: formData.price ? parseFloat(formData.price) : 0,
        quantity: formData.quantity ? parseInt(formData.quantity) : 0,
        keywords: (formData.keywords || "").split(",").map((k) => k.trim()),
      };

      const authToken = localStorage.getItem("authToken");
      const url = isEditing
        ? `http://localhost:5000/product/${id}`
        : "http://localhost:5000/product/add";

      const method = isEditing ? "PUT" : "POST";

      // First submit the product data
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authToken}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${isEditing ? "update" : "create"} product`
        );
      }

      // If this is an edit and FeaturedRequest is "Pending", use the special endpoint
      if (isEditing && formData.FeaturedRequest === "Pending") {
        const featureResponse = await fetch(
          `http://localhost:5000/product/request-feature/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `${authToken}`,
            },
          }
        );

        if (!featureResponse.ok) {
          const featureData = await featureResponse.json();
          throw new Error(
            featureData.message || "Failed to submit feature request"
          );
        }
      }

      // Reset form if creating new product
      if (!isEditing) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setFormData({
          productname: "",
          description: "",
          price: "",
          formula: "NaN",
          type: "",
          FeaturedRequest: "None",
          keywords: "",
          image: "",
          quantity: "",
        });
        setImageFile(null);
        setImagePreview("");
      }

      setMessage(
        `Product ${isEditing ? "updated" : "created"} successfully!${
          isEditing && formData.FeaturedRequest === "Pending"
            ? " Feature request submitted."
            : ""
        }`
      );

      // Redirect after successful edit
      if (isEditing) {
        setTimeout(() => navigate("/vendor-homepage"), 1500);
      }
    } catch (error) {
      setMessage(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-16 px-6 lg:px-10 xl:px-20"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1397790017/photo/a-close-up-view-of-an-unrecognizable-females-hand-holding-some-beauty-product.jpg?s=612x612&w=0&k=20&c=UyXEdAfaaN_BMjFervT2QyYjdaTE6qAsj1IyypE1k5Q=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Frosted glass overlay */}
      <div className="fixed inset-0 bg-white/10 backdrop-blur-sm" />

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 rounded-2xl shadow-2xl
           backdrop-blur-xl bg-white/80 border border-white/90
           relative overflow-hidden hover:shadow-xl transition-shadow
           z-10"
      >
        {/* Top accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-cyan-500" />

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
            {isEditing ? "Edit Product" : "Create Product"}
          </h2>
          <div className="w-20 h-1 mt-2 bg-gradient-to-r from-teal-600 to-cyan-500 rounded-full" />
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl border-l-4 ${
              message.includes("success")
                ? "border-teal-500 bg-teal-50/90 text-teal-900"
                : "border-red-400 bg-red-50/90 text-red-900"
            }`}
          >
            {message}
          </div>
        )}

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Product Name *
              </label>
              <input
                type="text"
                name="productname"
                value={formData.productname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200
                      bg-white/90 backdrop-blur-sm focus:outline-none
                      focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                      placeholder-slate-400 text-slate-800
                      transition-all duration-200 shadow-sm"
                placeholder="Enter product name"
              />
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-teal-600/80">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200
                        bg-white/90 backdrop-blur-sm focus:outline-none
                        focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                        placeholder-slate-400 text-slate-800
                        transition-all duration-200 shadow-sm"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200
                      bg-white/90 backdrop-blur-sm focus:outline-none
                      focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                      placeholder-slate-400 text-slate-800
                      transition-all duration-200 shadow-sm"
                placeholder="Enter quantity"
                min="0"
              />
            </div>

            {/* Type Selector */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Type *
              </label>
              <div className="relative">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200
                        bg-white/90 backdrop-blur-sm focus:outline-none
                        focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                        text-slate-800 appearance-none
                        transition-all duration-200 shadow-sm"
                >
                  <option value="">Select product type</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Insecticide">Insecticide</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Gadget">Gadget</option>
                </select>
                <div className="absolute right-4 top-3.5 text-teal-600/80 pointer-events-none">
                  ▼
                </div>
              </div>
            </div>

            {/* Formula */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Formula
              </label>
              <input
                type="text"
                name="formula"
                value={formData.formula}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200
                      bg-white/90 backdrop-blur-sm focus:outline-none
                      focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                      placeholder-slate-400 text-slate-800
                      transition-all duration-200 shadow-sm"
                placeholder="Chemical formula"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200
                      bg-white/90 backdrop-blur-sm focus:outline-none
                      focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                      placeholder-slate-400 text-slate-800
                      transition-all duration-200 shadow-sm resize-none"
                placeholder="Product description..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Product Image {!isEditing && "*"}
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleChange}
                  required={!isEditing} // Only required when not editing
                  ref={fileInputRef}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200
                bg-white/90 backdrop-blur-sm focus:outline-none
                focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                placeholder-slate-400 text-slate-800
                transition-all duration-200 shadow-sm"
                />
                {imagePreview && (
                  <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                {isEditing && (
                  <p className="text-xs text-slate-500">
                    Leave empty to keep current image
                  </p>
                )}
              </div>
            </div>

            {/* Keywords */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700/90">
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200
                      bg-white/90 backdrop-blur-sm focus:outline-none
                      focus:border-teal-600 focus:ring-2 focus:ring-teal-100
                      placeholder-slate-400 text-slate-800
                      transition-all duration-200 shadow-sm"
                placeholder="comma, separated, keywords"
              />
            </div>

            {/* Featured Toggle */}
            {/* Featured Toggle */}
            <div className="flex items-center pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                {/* Hidden Checkbox */}
                <input
                  type="checkbox"
                  name="isFeatured" // Keep this name for the checkbox
                  checked={formData.FeaturedRequest === "Pending"} // Check based on FeaturedRequest
                  onChange={handleChange}
                  className="sr-only"
                />
                {/* Toggle Track */}
                <div
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    formData.FeaturedRequest === "Pending"
                      ? "bg-teal-600"
                      : "bg-slate-200"
                  }`}
                >
                  {/* Toggle Circle */}
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${
                      formData.FeaturedRequest === "Pending"
                        ? "translate-x-4"
                        : "translate-x-0"
                    }`}
                  />
                </div>
                {/* Label */}
                <span className="text-sm font-medium text-slate-700/90">
                  Request Featured Status
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 py-3 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 
              text-white font-medium tracking-wide transition-all duration-300
              shadow-lg hover:shadow-xl hover:scale-[1.008] 
              disabled:opacity-70 disabled:cursor-not-allowed
              relative overflow-hidden group hover:bg-gradient-to-r hover:from-teal-700 hover:to-cyan-600"
        >
          <span className="relative z-10">
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">↻</span>
                {isEditing ? "Updating..." : "Creating..."}
              </span>
            ) : isEditing ? (
              "Update Product"
            ) : (
              "Create Product"
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

export default CreateListing;
