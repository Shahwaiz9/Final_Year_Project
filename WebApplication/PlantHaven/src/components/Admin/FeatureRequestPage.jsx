import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsClockHistory, BsCheckCircle, BsXCircle } from "react-icons/bs";

function FeatureRequestPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

    useEffect(() => {
    fetchPendingRequests();
  }, [refresh]);

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const res = await axios.get(
        "http://localhost:5000/admin/pending-feature-requests",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch pending feature requests");
    }
    setLoading(false);
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem("authToken");

      await axios.post(
        `http://localhost:5000/admin/feature-request/${id}`,
        { action },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      alert(`Feature request ${action}d successfully`);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
      alert("Failed to update feature request");
    }
  };


  return (
    <div className="main-container">
      <div className="main-title">
        <h1 className="flex items-center gap-3 text-white text-3xl font-bold">
          <BsClockHistory className="text-blue-400 icon_header" />
          Pending Feature Requests
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-400 mb-6"></div>
          <p className="text-lg text-gray-400">Loading pending requests...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="card text-center">
          <p className="text-lg">No pending feature requests.</p>
        </div>
      ) : (
        <div className="main-cards">
          {products.map((product) => (
            <div className="card hover:scale-105 transition-transform duration-300" key={product._id} style={{backgroundColor:"#1A4848"}}>
              {/* Product Image */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.productname}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}

              {/* Product Info */}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-white">{product.productname}</h2>
                <p className="text-gray-400 text-sm">{product.description}</p>

                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <span className="font-bold text-white">Vendor:</span> {product.vendor?.CompanyName || "Unknown"}
                  </div>
                  <div>
                    <span className="font-bold text-white">Price:</span> Rs. {product.price}
                  </div>
                  <div>
                    <span className="font-bold text-white">Type:</span> {product.type}
                  </div>
                  <div>
                    <span className="font-bold text-white">Formula:</span> {product.formula}
                  </div>
                  <div>
                    <span className="font-bold text-white">Quantity:</span> {product.quantity}
                  </div>
                  <div>
                    <span className="font-bold text-white">Feature Request:</span> {product.FeaturedRequest}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => handleAction(product._id, "approve")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500 hover:bg-green-600 transition text-white font-semibold"
                >
                  <BsCheckCircle className="text-lg" />
                  Approve
                </button>
                <button
                  onClick={() => handleAction(product._id, "reject")}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition text-white font-semibold"
                >
                  <BsXCircle className="text-lg" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom spinner animation */}
      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default FeatureRequestPage;
