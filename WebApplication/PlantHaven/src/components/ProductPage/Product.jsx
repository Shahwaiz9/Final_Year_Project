import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/product/${id}`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        const data = await response.json();
        setProduct(data.Product);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, authToken]);

  const handleOrder = () => {
    navigate(`/confirm-order/${id}`, { state: { quantity } });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-slate-600">
          Loading product details...
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Product not found</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Product Container */}
        <div className="bg-white rounded-2xl shadow-3xl overflow-hidden border-slate-300 border-2 mt-24">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section - Enhanced */}
            <div className="lg:w-1/2 p-8 bg-gradient-to-br from-slate-50 to-green-50 relative group">
              <div className="absolute inset-0 bg-[radial-gradient(#22d3ee12_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
              <div className="relative h-96 rounded-xl bg-white shadow-inner border border-slate-200 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.productname}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
              </div>

              {/* Floating Badge */}
              {product.isFeatured && (
                <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Details Section - Enhanced */}
            <div className="lg:w-1/2 p-8 flex flex-col">
              <div className="flex-1 space-y-6">
                {/* Header Section */}
                <div className="border-b border-slate-100 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        {product.productname}
                      </h1>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                          {product.type}
                        </span>
                        <span className="text-slate-500 text-sm">
                          In Stock: {product.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                      Rs. {product.price}
                    </div>
                  </div>
                </div>

                {/* Vendor & Formula */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg
                      className="w-5 h-5 text-green-600"
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
                    <span className="font-medium">
                      Sold by {product.vendor.CompanyName}
                    </span>
                  </div>

                  {product.formula !== "NaN" && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-green-700"
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
                        <p className="font-mono text-sm text-green-900 font-medium">
                          Formula: {product.formula}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="prose prose-sm text-slate-700">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">
                    Description
                  </h3>
                  <p>{product.description}</p>
                </div>

                {/* Keywords */}
                {product.keywords?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-2">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2.5 py-1 text-xs bg-white border border-slate-200 text-slate-700 rounded-full shadow-sm hover:bg-slate-50 transition-colors"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Section */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                            color="black"
                          />
                        </svg>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-16 text-center border border-slate-200 rounded-lg py-2 px-1"
                        min="1"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                            color="black"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleOrder}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
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
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
