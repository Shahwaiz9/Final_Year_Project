import React from "react";
import { useNavigate } from "react-router-dom";

const dummyProducts = [
  {
    _id: "1",
    productname: "Organic Fertilizer",
    vendor: "GreenThumb",
    description: "High-quality organic fertilizer for all plants",
    price: 29.99,
    formula: "NPK 5-3-4",
    type: "Fertilizer",
    keywords: ["organic", "plant food", "natural"],
    image:
      "https://risso-chemical.com/wp-content/uploads/2024/04/Bulk-Blending-Fertilizer.png",
  },
  {
    _id: "2",
    productname: "Rose Food",
    vendor: "BloomMaster",
    description: "Specialized nutrition for rose bushes",
    price: 19.99,
    formula: "NPK 4-6-4",
    type: "Plant Food",
    keywords: ["roses", "flower care"],
    image:
      "https://www.flowerscambridge.co.uk/upload/mt/tmf205/products/th_null-plant-care-kit-2.jpg",
  },
  {
    _id: "3",
    productname: "Vegetable Boost",
    vendor: "HarvestPro",
    description: "Enhances vegetable growth and yield",
    price: 24.99,
    formula: "NPK 6-2-4",
    type: "Fertilizer",
    keywords: ["vegetables", "garden"],
    image:
      "https://ikesproducts.com/wp-content/uploads/2021/06/Ikes-Product-LawnBooster-Product-2022.png",
  },
  {
    _id: "4",
    productname: "Lawn Care Kit",
    vendor: "GreenThumb",
    description: "Complete kit for lush green lawns",
    price: 49.99,
    formula: "NaN",
    type: "Lawn Care",
    keywords: ["lawn", "grass"],
    image:
      "https://andermattgarden.co.uk/cdn/shop/products/GROPUREHOUSEPLANTS500MLTRANSPARENT_1f8b2210-6c47-4ec6-9929-5654d6582abb_1293x.png?v=1680794140",
  },
];

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      className="bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-all 
                 duration-300 group border-2 border-slate-300 hover:border-green-300
                 relative overflow-hidden transform hover:-translate-y-1
                 bg-gradient-to-br from-white to-green-200/30 hover:bg-white
                 isolate flex flex-col h-full"
    >
      {/* Featured Badge - Top Right Corner */}
      {product.isFeatured && (
        <div className="absolute top-2 right-2 z-20">
          <span className="px-2 py-1 text-xs font-bold bg-amber-400 text-amber-900 rounded-full shadow-md flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </span>
        </div>
      )}

      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-green-100/10 to-green-400/20 blur-sm group-hover:blur-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />

      <div className="relative h-48 overflow-hidden bg-slate-50 flex-shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(#22d3ee12_1px,transparent_1px)] [background-size:16px_16px]" />
        <img
          src={product.image}
          alt={product.productname}
          className="relative z-10 w-full h-full object-contain transition-transform 
                   duration-300 group-hover:scale-105 mix-blend-multiply"
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/40 to-transparent" />
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-md font-bold text-slate-900">
                {product.productname}
              </h3>
              <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-cyan-800 rounded-full">
                {product.type}
              </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1">
              <svg
                className="w-3 h-3 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="font-medium text-green-700">
                {product.vendor.CompanyName}
              </span>
            </p>
          </div>

          {product.formula !== "NaN" && (
            <div className="p-1.5 bg-green-100/85 rounded-lg border border-green-100">
              <div className="flex items-center gap-1.5 text-sm">
                <svg
                  className="w-3 h-3 text-green-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <p className="font-mono text-xs text-green-900 font-medium">
                  {product.formula}
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-1.5 overflow-x-auto hide-scrollbar">
          <div className="flex gap-1.5 w-max">
            {product.keywords.map((keyword) => (
              <span
                key={keyword}
                className="flex-shrink-0 px-1.5 py-0.5 text-xs bg-white border border-slate-200 
                 text-slate-700 rounded-full shadow-sm"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 mt-1.5 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-500">Price</span>
              <p className="text-lg font-bold text-slate-900">
                R.s {product.price}
              </p>
            </div>
            <button
              onClick={handleOrderClick}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg 
                       hover:bg-green-700 transition-colors shadow-sm text-sm font-medium"
            >
              Order Now!
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
