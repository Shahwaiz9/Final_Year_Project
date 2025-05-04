import { useState, useEffect } from "react";

const UserOrders = () => {
  const authToken = localStorage.getItem("authToken");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/orders/user-orders",
          {
            headers: { Authorization: authToken },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();
        // Sort orders by date (newest first)
        const sortedOrders = data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
        setFilteredOrders(sortedOrders);
      } catch (err) {
        setError(err.message || "Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authToken]);

  // Filter orders based on active filter
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.status === activeFilter)
      );
    }
  }, [activeFilter, orders]);

  // Format date using native JavaScript
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#759e9e] to-[#00c7c7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mt-22 mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Orders</h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeFilter === "all"
                ? "bg-white text-green-700 shadow-md"
                : "bg-white/50 text-slate-700 hover:bg-white/80"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveFilter("Pending")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeFilter === "Pending"
                ? "bg-white text-yellow-700 shadow-md"
                : "bg-white/50 text-slate-700 hover:bg-white/80"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter("Processing")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeFilter === "Processing"
                ? "bg-white text-blue-700 shadow-md"
                : "bg-white/50 text-slate-700 hover:bg-white/80"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setActiveFilter("Delivered")}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeFilter === "Delivered"
                ? "bg-white text-green-700 shadow-md"
                : "bg-white/50 text-slate-700 hover:bg-white/80"
            }`}
          >
            Delivered
          </button>
        </div>

        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-slate-600 text-lg">
                {activeFilter === "all"
                  ? "No orders found"
                  : `No ${activeFilter.toLowerCase()} orders found`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Product Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={order.product?.image}
                      alt={order.product?.productname}
                      className="w-20 h-20 object-contain border border-slate-200 rounded-lg"
                    />
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {order.product?.productname}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Sold by: {order.vendor?.CompanyName}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Order Date:</span>
                      <span className="font-medium text-slate-900">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Quantity:</span>
                      <span className="font-medium text-slate-900">
                        {order.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Total Amount:</span>
                      <span className="text-lg font-bold text-green-700">
                        Rs. {order.totalAmount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Payment Method:</span>
                      <span className="font-medium text-slate-900 capitalize">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Delivery To:</span>
                      <span className="font-medium text-slate-900">
                        {order.city}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrders;
