import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const VendorHomePage = ({ setIsAuthenticated }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState(0);
  const [vendorStats, setVendorStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSalesAmount: 0,
  });
  const [selectedStat, setSelectedStat] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Stats configuration
  const statsConfig = [
    {
      title: "Total Products",
      value: totalProducts,
      color: "teal",
    },
    {
      title: "Featured Products",
      value: featuredProducts,
      color: "cyan",
    },
    {
      title: "Total Orders",
      value: vendorStats.totalOrders,
      color: "purple",
      type: "all",
    },
    {
      title: "Pending Orders",
      value: vendorStats.pendingOrders,
      color: "orange",
      type: "pending",
      filter: (order) => ["Pending", "Processing"].includes(order.status),
    },
    {
      title: "Completed Orders",
      value: vendorStats.completedOrders,
      color: "green",
      type: "completed",
      filter: (order) => order.status === "Delivered",
    },
    {
      title: "Total Sales",
      value: `$${vendorStats.totalSalesAmount.toFixed(2)}`,
      color: "blue",
    },
  ];

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || user.role !== "vendor") {
          throw new Error("Vendor authentication required");
        }

        // Fetch products
        const productsResponse = await fetch("http://localhost:5000/product", {
          headers: { Authorization: `${authToken}` },
        });
        if (!productsResponse.ok) throw new Error("Failed to fetch products");
        const productsData = await productsResponse.json();

        const vendorProducts = productsData.products.filter(
          (product) => product.vendorId === user._id
        );
        setProducts(vendorProducts);
        setTotalProducts(vendorProducts.length);
        setFeaturedProducts(vendorProducts.filter((p) => p.isFeatured).length);

        // Fetch vendor stats
        const statsResponse = await fetch(
          "http://localhost:5000/vendor-stats",
          {
            headers: { Authorization: `${authToken}` },
          }
        );
        if (!statsResponse.ok) throw new Error("Failed to fetch vendor stats");
        const { stats } = await statsResponse.json();
        console.log(stats);
        setVendorStats(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch orders when stat is selected
  useEffect(() => {
    const fetchOrders = async () => {
      if (selectedStat) {
        try {
          setOrderLoading(true);
          const authToken = localStorage.getItem("authToken");
          const response = await fetch(
            "http://localhost:5000/orders/vendor-orders",
            {
              headers: { Authorization: `${authToken}` },
            }
          );

          if (!response.ok) throw new Error("Failed to fetch orders");
          const { orders } = await response.json();

          setAllOrders(orders);
          const selectedFilter = statsConfig.find(
            (s) => s.type === selectedStat
          )?.filter;
          setDisplayOrders(
            selectedFilter ? orders.filter(selectedFilter) : orders
          );
        } catch (err) {
          setOrderError(err.message);
        } finally {
          setOrderLoading(false);
        }
      }
    };

    fetchOrders();
  }, [selectedStat]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/product/delete/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `${authToken}` },
        }
      );

      if (!response.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setTotalProducts((prev) => prev - 1);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle stat card clicks
  const handleStatClick = (statType) => {
    setSelectedStat((prev) => (prev === statType ? null : statType));
  };

  // Status update handler
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const orderToUpdate = allOrders.find((o) => o._id === orderId);

      if (!["Pending", "Processing"].includes(orderToUpdate.status)) {
        throw new Error("Only pending/processing orders can be updated");
      }

      // Optimistic update
      setAllOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      setDisplayOrders((prev) =>
        prev.filter(
          (order) =>
            order._id !== orderId ||
            ["Pending", "Processing"].includes(newStatus)
        )
      );

      const response = await fetch(
        `http://localhost:5000/orders/update-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authToken}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      // Refresh stats
      const statsResponse = await fetch("http://localhost:5000/vendor-stats", {
        headers: { Authorization: `${authToken}` },
      });
      const { stats } = await statsResponse.json();
      setVendorStats(stats);
    } catch (err) {
      // Rollback
      const ordersResponse = await fetch(
        "http://localhost:5000/orders/vendor-orders",
        {
          headers: { Authorization: `${authToken}` },
        }
      );
      const { orders: freshOrders } = await ordersResponse.json();
      setAllOrders(freshOrders);

      const selectedFilter = statsConfig.find(
        (s) => s.type === selectedStat
      )?.filter;
      setDisplayOrders(
        selectedFilter ? freshOrders.filter(selectedFilter) : freshOrders
      );

      setOrderError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">↻</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-16 px-6 lg:px-10 xl:px-20 pb-20"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1397790017/photo/a-close-up-view-of-an-unrecognizable-females-hand-holding-some-beauty-product.jpg?s=612x612&w=0&k=20&c=UyXEdAfaaN_BMjFervT2QyYjdaTE6qAsj1IyypE1k5Q=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="fixed inset-0 bg-white/10 backdrop-blur-sm" />

      <button
        onClick={logout}
        className="fixed top-4 right-4 z-50 py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 
               text-white font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl 
               hover:scale-[1.02] backdrop-blur-sm border border-white/30"
      >
        Logout
      </button>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Vendor Profile Section */}
        <div className="mb-8 p-6 md:p-8 rounded-2xl backdrop-blur-xl bg-white/80 border border-white/90 shadow-xl w-full">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            <div className="relative group mx-auto md:mx-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-teal-100 flex items-center justify-center">
                <svg
                  className="w-14 h-14 md:w-16 md:h-16 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <button className="absolute -top-2 -right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-teal-100 transition-colors border border-white/30">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 space-y-4 w-full text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-teal-800">
                {user?.CompanyName || "Your Store"}
              </h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {statsConfig.map((stat, index) => (
                  <div
                    key={index}
                    className={`p-3 md:p-4 rounded-xl backdrop-blur-sm bg-white/70 border border-white/80 w-full ${
                      stat.type
                        ? "cursor-pointer hover:scale-[1.02] transition-transform"
                        : ""
                    } ${
                      selectedStat === stat.type ? "ring-2 ring-teal-500" : ""
                    }`}
                    onClick={() => stat.type && handleStatClick(stat.type)}
                  >
                    <h3
                      className={`text-base md:text-lg font-semibold text-${stat.color}-700`}
                    >
                      {stat.title}
                    </h3>
                    <p className="text-2xl md:text-3xl font-light mt-1">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-slate-700">
                <p className="flex items-center gap-2 justify-center md:justify-start">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        {selectedStat && (
          <div className="mb-12 w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-slate-800">
                {statsConfig.find((s) => s.type === selectedStat)?.title}
              </h2>
              <button
                onClick={() => setSelectedStat(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            {orderLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin text-2xl">↻</div>
              </div>
            ) : orderError ? (
              <div className="text-red-600 text-center py-4">{orderError}</div>
            ) : displayOrders.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <p>No orders found in this category</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {displayOrders.map((order) => (
                  <div
                    key={order._id}
                    className="p-6 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/90 shadow-lg"
                  >
                    <div className="flex gap-4">
                      <img
                        src={order.product.image}
                        alt={order.product.productname}
                        className="w-20 h-20 object-contain rounded-lg bg-gray-50"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {order.product.productname}
                        </h3>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-sm text-slate-500">Quantity</p>
                            <p className="font-medium">{order.quantity}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">
                              Total Amount
                            </p>
                            <p className="font-medium">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Customer</p>
                            <p className="font-medium">{order.user.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Status</p>
                            {["Pending", "Processing"].includes(
                              order.status
                            ) ? (
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusUpdate(order._id, e.target.value)
                                }
                                className="bg-white/50 border border-slate-200 rounded-lg px-2 py-1 text-sm w-full appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem]"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            ) : (
                              <p className="font-medium">{order.status}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Link
          to="/createlisting"
          className="mb-12 w-full md:w-auto py-4 px-8 text-center rounded-xl bg-gradient-to-r from-teal-600 to-cyan-500 
                text-white font-medium tracking-wide transition-all duration-300 text-lg
                shadow-lg hover:shadow-xl hover:scale-[1.008] block md:mx-auto"
        >
          Create New Listing
        </Link>

        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center md:text-left">
          Your Listings ({totalProducts})
        </h2>

        {products.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-xl">You haven't listed any products yet</p>
            <p className="mt-2">
              Click "Create New Listing" to add your first product
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6 w-full max-w-7xl">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="flex flex-col p-4 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/90 shadow-lg hover:shadow-xl transition-shadow mx-auto w-full max-w-xs"
                >
                  <div className="w-full h-40 mb-3 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.productname}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 flex flex-col min-h-[180px]">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-slate-800 line-clamp-1">
                        {product.productname}
                      </h3>
                      {product.keywords?.length > 0 && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {product.keywords
                            .map((k) => `#${k.trim()}`)
                            .join(" ")}
                        </p>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>

                    <div className="mt-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-teal-600 font-bold">
                          ${product.price}
                        </span>
                        {product.isFeatured && (
                          <span className="text-cyan-600 text-sm flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="flex-1 py-2 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                          onClick={() => {
                            /* edit */
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          onClick={() => handleDelete(product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorHomePage;
