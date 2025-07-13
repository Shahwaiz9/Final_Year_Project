import { useState, useEffect } from "react";
import ProductCard from "../ProductCard";

const MarketPlace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [products, setProducts] = useState([]); // All products from API
  const [filteredProducts, setFilteredProducts] = useState([]); // Products after filters
  const [displayedProducts, setDisplayedProducts] = useState([]); // Products to show on current page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 1,
  });

  // Fetch ALL products from API (no pagination)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");

        let url = `http://localhost:5000/product/all`;
        if (searchTerm.trim()) {
          url = `http://localhost:5000/product/search-all/${encodeURIComponent(
            searchTerm.trim()
          )}`;
        }

        const response = await fetch(url, {
          headers: {
            Authorization: `${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  // Calculate price range when products change
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);

  // Apply filters whenever products or filter criteria change
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesType =
        selectedType === "all" || product.type === selectedType;
      const matchesVendor =
        selectedVendor === "all" ||
        product.vendor.CompanyName === selectedVendor;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesType && matchesVendor && matchesPrice;
    });

    // Sort featured products first
    const sorted = [...filtered].sort((a, b) => {
      if (a.isFeatured === b.isFeatured) return 0;
      return a.isFeatured ? -1 : 1;
    });

    setFilteredProducts(sorted);

    // Update pagination totals
    const total = sorted.length;
    const pages = Math.ceil(total / pagination.limit);
    setPagination((prev) => ({
      ...prev,
      total,
      pages,
      page: 1, // Reset to first page when filters change
    }));
  }, [products, selectedType, selectedVendor, priceRange]);

  // Apply pagination whenever filtered products or pagination changes
  useEffect(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Get unique types and vendors
  const uniqueTypes = [...new Set(products.map((p) => p.type))];
  const uniqueVendors = [...new Set(products.map((p) => p.vendor.CompanyName))];

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-400 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      {/* Filters Section */}
      <div className=" rounded-xl shadow-lg mx-4 md:mx-6 lg:mx-8 mt-16">
        <div className="p-6 space-y-6">
          {/* Search Bar and Filters Button */}
          <div className="flex gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl border border-slate-200 
                           focus:outline-none focus:ring-2 focus:ring-green-100
                           focus:border-green-600 placeholder-slate-400
                           bg-white shadow-sm text-slate-700"
                />
                <button
                  type="submit"
                  className="absolute right-4 top-4 text-slate-500 hover:text-green-600 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
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
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:border-green-400
                       flex items-center gap-2 hover:bg-green-50 transition-colors"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="text-slate-700">Filters</span>
            </button>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 
                           focus:outline-none focus:ring-2 focus:ring-green-100
                           focus:border-green-600 bg-white text-slate-700"
                >
                  <option value="all">All Types</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Vendor
                </label>
                <select
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 
                           focus:outline-none focus:ring-2 focus:ring-green-100
                           focus:border-green-600 bg-white text-slate-700"
                >
                  <option value="all">All Vendors</option>
                  {uniqueVendors.map((vendor) => (
                    <option key={vendor} value={vendor}>
                      {vendor}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 
                             focus:outline-none focus:ring-2 focus:ring-green-100
                             focus:border-green-600 bg-white text-slate-700"
                  />
                  <span className="text-slate-400">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 
                             focus:outline-none focus:ring-2 focus:ring-green-100
                             focus:border-green-600 bg-white text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-600">
                No products found matching your criteria
              </p>
            </div>
          )}
        </div>
        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8 text-black">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-green-400 
                         hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg border ${
                      pagination.page === page
                        ? "bg-green-600 text-white border-green-600"
                        : "border-slate-200 hover:bg-green-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-green-400
                         hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
};

export default MarketPlace;
