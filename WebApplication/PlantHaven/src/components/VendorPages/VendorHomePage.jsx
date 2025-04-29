import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

const VendorHomePage = ({ setIsAuthenticated }) => {
  // State management
  const [vendorInfo, setVendorInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    CompanyName: "",
    CompanyAddress: "",
    email: "",
    contact: "",
    profilePic: "",
  });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [vendorStats, setVendorStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalSalesAmount: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");
  const [productsPage, setProductsPage] = useState(1);
  const productsPerPage = 4;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("products");

  const navigate = useNavigate();

  // Sidebar menu configuration
  const menuItems = [
    {
      title: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      view: "dashboard",
    },
    {
      title: "All Products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      view: "products",
      count: products.length,
    },
    {
      title: "Featured Products",
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
      view: "featured-products",
      count: products.filter((p) => p.isFeatured).length,
    },
    {
      title: "Total Orders",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      view: "total-orders",
      count: vendorStats.totalOrders,
      statType: "all",
    },
    {
      title: "Pending Orders",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      view: "pending-orders",
      count: vendorStats.pendingOrders,
      statType: "pending",
    },
    {
      title: "Completed Orders",
      icon: "M5 13l4 4L19 7",
      view: "completed-orders",
      count: vendorStats.completedOrders,
      statType: "completed",
    },
    {
      title: "Total Sales",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      view: "total-sales",
      value: `Rs. ${vendorStats.totalSalesAmount.toFixed(2)}`,
    },
  ];

  // Table columns configuration
  const columns = useMemo(
    () => [
      columnHelper.accessor("createdAt", {
        header: "Order Date",
        cell: (info) => (
          <span className="text-gray-900 font-medium">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
        sortingFn: "datetime",
      }),
      columnHelper.accessor("user.name", {
        header: "Customer",
        cell: (info) => (
          <div>
            <p className="text-gray-900 font-medium">{info.getValue()}</p>
            <p className="text-gray-500 text-sm">
              {info.row.original.user.email}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor("product.productname", {
        header: "Product",
        cell: (info) => (
          <div className="flex items-center">
            <img
              src={info.row.original.product.image}
              alt={info.getValue()}
              className="w-10 h-10 rounded-md object-cover mr-3 border border-gray-200"
            />
            <span className="text-gray-900 font-medium">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "Qty",
        cell: (info) => (
          <span className="inline-block px-2 py-1 bg-gray-100 rounded-md text-gray-900 font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("totalAmount", {
        header: "Total",
        cell: (info) => (
          <span className="text-gray-900 font-bold">
            Rs. {info.getValue().toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row, getValue }) => {
          const status = getValue();
          const orderId = row.original._id;

          return ["Pending", "Processing"].includes(status) ? (
            <select
              value={status}
              onChange={(e) => handleStatusUpdate(orderId, e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Delivered">Delivered</option>
            </select>
          ) : (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      }),
    ],
    []
  );

  // Search logic for products
  const searchedProducts = useMemo(() => {
    // Only search if we're in a product view and have a search term
    const shouldSearch =
      (currentView === "products" || currentView === "featured-products") &&
      searchTerm;
    if (!shouldSearch) return filteredProducts;

    const lowerCaseTerm = searchTerm.toLowerCase();

    return filteredProducts.filter((product) => {
      const matchesName = product.productname
        .toLowerCase()
        .includes(lowerCaseTerm);
      const matchesDesc = product.description
        .toLowerCase()
        .includes(lowerCaseTerm);
      const matchesKeywords = product.keywords?.some((k) =>
        k.toLowerCase().includes(lowerCaseTerm)
      );

      return matchesName || matchesDesc || matchesKeywords;
    });
  }, [filteredProducts, searchTerm, currentView]);

  // Search logic for orders
  // Search logic for orders
  const searchedOrders = useMemo(() => {
    const isOrderView =
      currentView === "total-orders" ||
      currentView === "pending-orders" ||
      currentView === "completed-orders";
    if (!searchTerm || !isOrderView) return displayOrders;

    return displayOrders.filter(
      (order) =>
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.productname
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [displayOrders, searchTerm, currentView]);

  // React Table instance
  const table = useReactTable({
    data:
      currentView.includes("order") && searchTerm
        ? searchedOrders
        : displayOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle menu item click
  const handleMenuItemClick = (view, statType) => {
    setCurrentView(view);
    if (statType) {
      setSelectedStat(statType);
    }
  };

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");

        const [productsRes, vendorRes, statsRes] = await Promise.all([
          fetch("http://localhost:5000/vendor/my-products", {
            headers: { Authorization: authToken },
          }),
          fetch("http://localhost:5000/vendor/profile-info", {
            headers: { Authorization: authToken },
          }),
          fetch("http://localhost:5000/vendor-stats", {
            headers: { Authorization: authToken },
          }),
        ]);

        if (!productsRes.ok || !vendorRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [productsData, vendorData, statsData] = await Promise.all([
          productsRes.json(),
          vendorRes.json(),
          statsRes.json(),
        ]);

        setProducts(productsData.products);
        setVendorInfo(vendorData.vendorInfo[0]);
        setVendorStats(statsData.stats);
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
            { headers: { Authorization: authToken } }
          );

          if (!response.ok) throw new Error("Failed to fetch orders");
          const { orders } = await response.json();
          setAllOrders(orders);
          console.log(orders);
          const selectedFilter =
            menuItems.find((s) => s.statType === selectedStat)?.statType ===
            "all"
              ? null
              : (order) =>
                  selectedStat === "pending"
                    ? ["Pending", "Processing"].includes(order.status)
                    : order.status === "Delivered";

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

    if (selectedStat) {
      fetchOrders();
    }
  }, [selectedStat]);

  // Filter products based on current view
  useEffect(() => {
    if (currentView === "products") {
      setFilteredProducts(products);
    } else if (currentView === "featured-products") {
      setFilteredProducts(products.filter((p) => p.isFeatured));
    }
    setProductsPage(1); // Reset to first page when view changes
  }, [currentView, products]);

  // Paginate products
  const paginatedProducts = filteredProducts.slice(
    (productsPage - 1) * productsPerPage,
    productsPage * productsPerPage
  );

  const totalProductPages = Math.ceil(
    (searchTerm && searchCategory === "products"
      ? searchedProducts.length
      : filteredProducts.length) / productsPerPage
  );

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/product/delete/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: authToken },
        }
      );

      if (!response.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const authToken = localStorage.getItem("authToken");

      // Optimistic update
      setDisplayOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      const response = await fetch(
        `http://localhost:5000/orders/update-status/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      // Refresh stats
      const statsResponse = await fetch("http://localhost:5000/vendor-stats", {
        headers: { Authorization: authToken },
      });
      const { stats } = await statsResponse.json();
      setVendorStats(stats);

      // Refresh orders if needed
      if (["Pending", "Processing"].includes(newStatus)) {
        const ordersResponse = await fetch(
          "http://localhost:5000/orders/vendor-orders",
          { headers: { Authorization: authToken } }
        );
        const { orders } = await ordersResponse.json();
        setAllOrders(orders);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert on error
      const ordersResponse = await fetch(
        "http://localhost:5000/orders/vendor-orders",
        { headers: { Authorization: authToken } }
      );
      const { orders } = await ordersResponse.json();
      setAllOrders(orders);

      const selectedFilter =
        menuItems.find((s) => s.statType === selectedStat)?.statType === "all"
          ? null
          : (order) =>
              selectedStat === "pending"
                ? ["Pending", "Processing"].includes(order.status)
                : order.status === "Delivered";

      setDisplayOrders(selectedFilter ? orders.filter(selectedFilter) : orders);
    }
  };

  const handleSave = async () => {
    try {
      setUploadingImage(true);
      let profilePicUrl = editData.profilePic; // Keep existing if no new image

      // Only upload if new image was selected
      if (imageFile) {
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "default_cloud_name"
        }/upload`;

        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "default_preset"
        );

        const uploadResponse = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Profile picture upload failed");
        }

        const uploadData = await uploadResponse.json();
        profilePicUrl = uploadData.secure_url;
      }

      // Update profile with all data
      const authToken = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/vendor/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({
          ...editData,
          profilePic: profilePicUrl,
        }),
      });

      if (!response.ok) throw new Error("Profile update failed");

      const { vendor: updatedVendor } = await response.json();
      setVendorInfo(updatedVendor);
      setIsEditing(false);
      setImageFile(null);
      setImagePreview("");
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert(err.message || "Failed to update profile");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Generate preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview("");
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-600">
        Error: {error}
        <p className="m-2">You need to SignIn again</p>
        <button
          onClick={logout}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 
                     text-white font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        backgroundImage:
          "linear-gradient(rgba(220,220,220,0.9), rgba(220,220,220,0.9)), url('https://static.vecteezy.com/system/resources/previews/034/959/020/non_2x/abstract-black-line-contour-pattern-white-background-wallpaper-free-png.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Sidebar */}
      <div
        className={`bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] bg-teal-800 text-white transition-all duration-300 fixed h-full z-20 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-teal-700">
          {sidebarOpen ? (
            <h2 className="text-xl font-bold">Vendor Dashboard</h2>
          ) : (
            <div className="w-8 h-8 bg-teal-700 rounded-full"></div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-teal-700 transition-colors"
          >
            {sidebarOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuItemClick(item.view, item.statType)}
                  className={`flex items-center w-full p-4 hover:bg-teal-700 transition-colors ${
                    currentView === item.view ? "bg-teal-700" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  {sidebarOpen && (
                    <span className="ml-3 flex-1 text-left">{item.title}</span>
                  )}
                  {sidebarOpen && (item.count || item.value) && (
                    <span className="bg-teal-600 px-2 py-1 rounded-full text-xs">
                      {item.count || item.value}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <div className="p-6 lg:p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {menuItems.find((item) => item.view === currentView)?.title}
            </h1>
            <button
              onClick={logout}
              className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 
                     text-white font-medium tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>
          </div>

          {(currentView === "products" ||
            currentView === "featured-products" ||
            currentView === "total-orders" ||
            currentView === "pending-orders" ||
            currentView === "completed-orders") && (
            <div className="mb-6">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={`Search ${
                    currentView.includes("product") ? "products" : "orders"
                  }...`}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Dashboard View */}
          {currentView === "dashboard" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Profile Picture Section */}
                <div className="relative group mx-auto md:mx-0">
                  <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center overflow-hidden border-2 border-teal-100">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : vendorInfo?.profilePic ? (
                      <img
                        src={vendorInfo.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-12 h-12 text-teal-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Vendor Information */}
                <div className="flex-1 w-full">
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Keep existing input fields exactly as they were */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={editData.CompanyName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              CompanyName: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Company Address
                        </label>
                        <input
                          type="text"
                          value={editData.CompanyAddress}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              CompanyAddress: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={editData.email}
                          onChange={(e) =>
                            setEditData({ ...editData, email: e.target.value })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Contact
                        </label>
                        <input
                          type="tel"
                          value={editData.contact}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              contact: e.target.value,
                            })
                          }
                          pattern="03[0-9]{9}"
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-teal-400 focus:border-teal-400"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={uploadingImage}
                          className={`px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center ${
                            uploadingImage
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {uploadingImage ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-2"
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
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-center md:text-left space-y-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                          {vendorInfo?.CompanyName || "Your Store"}
                        </h2>

                        <div className="flex items-center text-gray-600">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{vendorInfo?.email}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{vendorInfo?.CompanyAddress}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg
                            className="w-5 h-5 mr-2 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span>{vendorInfo?.contact}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditData({
                            CompanyName: vendorInfo?.CompanyName || "",
                            CompanyAddress: vendorInfo?.CompanyAddress || "",
                            email: vendorInfo?.email || "",
                            contact: vendorInfo?.contact || "",
                            profilePic: vendorInfo?.profilePic || "",
                          });
                          setImageFile(null);
                          setImagePreview("");
                        }}
                        className="mt-4 px-4 py-2 bg-white border border-teal-500 text-teal-600 rounded-md hover:bg-teal-50 transition-colors flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
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
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders Table View */}
          {(currentView === "total-orders" ||
            currentView === "pending-orders" ||
            currentView === "completed-orders") && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className="flex items-center">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " ↑",
                                desc: " ↓",
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleOrderClick(row.original)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200 gap-4">
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Rows per page:</span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                    className="px-3 py-1 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Products View */}
          {(currentView === "products" ||
            currentView === "featured-products") && (
            <div>
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    {currentView === "featured-products"
                      ? "You have no featured products yet"
                      : "You haven't listed any products yet"}
                  </p>
                  <Link
                    to="/createlisting"
                    className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Create New Listing
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {searchedProducts
                      .slice(
                        (productsPage - 1) * productsPerPage,
                        productsPage * productsPerPage
                      )
                      .map((product) => (
                        <div
                          key={product._id}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                            <img
                              src={product.image}
                              alt={product.productname}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                              {product.productname}
                            </h3>
                            {product.keywords?.length > 0 && (
                              <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                {product.keywords
                                  .map((k) => `#${k.trim()}`)
                                  .join(" ")}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {product.description}
                            </p>

                            {/* Quantity/Stock Display */}
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-sm text-gray-500">
                                Stock:
                              </span>
                              <span
                                className={`text-sm font-medium ${
                                  product.quantity > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {product.quantity}{" "}
                                {product.quantity === 1 ? "item" : "items"}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-teal-600 font-bold">
                                Rs. {product.price}
                              </span>
                              {product.isFeatured && (
                                <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                className="flex-1 py-2 text-sm bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                                onClick={() =>
                                  navigate(`/edit-product/${product._id}`)
                                }
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
                      ))}
                  </div>

                  {/* Products Pagination */}
                  {filteredProducts.length > productsPerPage && (
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() =>
                          setProductsPage((p) => Math.max(1, p - 1))
                        }
                        disabled={productsPage === 1}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 hover:bg-teal-800 transition-colors"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        Page {productsPage} of {totalProductPages}
                      </span>
                      <button
                        onClick={() =>
                          setProductsPage((p) =>
                            Math.min(totalProductPages, p + 1)
                          )
                        }
                        disabled={productsPage === totalProductPages}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50 hover:bg-teal-800 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Total Sales View */}
          {currentView === "total-sales" && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-5xl font-bold text-teal-600 mb-4">
                Rs. {vendorStats.totalSalesAmount.toFixed(2)}
              </div>
              <p className="text-gray-600">
                Total revenue from all completed orders
              </p>
            </div>
          )}

          {/* Create Listing Button */}
          <div className="fixed bottom-8 right-8">
            <Link
              to="/createlisting"
              className="inline-flex items-center justify-center p-4 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {sidebarOpen && <span className="ml-2">New Product</span>}
            </Link>
          </div>
        </div>
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-300">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Name:</span>{" "}
                        {selectedOrder.user.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedOrder.user.email}
                      </p>
                      <p>
                        <span className="font-medium">Contact:</span>{" "}
                        {selectedOrder.contactInfo}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Shipping Information
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Address:</span>{" "}
                        {selectedOrder.address}
                      </p>
                      <p>
                        <span className="font-medium">City:</span>{" "}
                        {selectedOrder.city}
                      </p>
                      <p>
                        <span className="font-medium">Postal Code:</span>{" "}
                        {selectedOrder.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Order Information
                    </h3>
                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Order Date:</span>{" "}
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium">Payment Method:</span>{" "}
                        {selectedOrder.paymentMethod}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedOrder.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedOrder.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h3 className="font-medium text-gray-700 mb-3">
                      Product Details
                    </h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={selectedOrder.product.image}
                        alt={selectedOrder.product.productname}
                        className="w-20 h-20 object-cover rounded-md border border-gray-200"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {selectedOrder.product.productname}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          {selectedOrder.product.description}
                        </p>
                        <div className="flex gap-4">
                          <p>
                            <span className="font-medium">Price:</span> Rs.{" "}
                            {selectedOrder.product.price}
                          </p>
                          <p>
                            <span className="font-medium">Quantity:</span>{" "}
                            {selectedOrder.quantity}
                          </p>
                          <p>
                            <span className="font-medium">Total:</span> Rs.{" "}
                            {selectedOrder.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorHomePage;
