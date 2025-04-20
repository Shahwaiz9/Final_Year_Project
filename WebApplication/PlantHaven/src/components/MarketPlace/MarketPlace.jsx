import { useState, useEffect } from "react";
import ProductCard from "../ProductCard";

const MarketPlace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedType, setSelectedType] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const authToken = localStorage.getItem("authToken");

        let url = "http://localhost:5000/product";
        if (searchTerm.trim()) {
          url = `http://localhost:5000/product/search/${encodeURIComponent(
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
        setProducts(data.products);
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

  // Get unique types and vendors
  const uniqueTypes = [...new Set(products.map((p) => p.type))];
  const uniqueVendors = [...new Set(products.map((p) => p.vendor))];

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesType = selectedType === "all" || product.type === selectedType;
    const matchesVendor =
      selectedVendor === "all" || product.vendor === selectedVendor;
    const matchesPrice =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return matchesType && matchesVendor && matchesPrice;
  });

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
    <div className="min-h-screen">
      {/* Filters Section */}
      <div className="bg-white/95 backdrop-blur z-10 shadow-sm border-b border-slate-100 mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch(e);
                }}
                className="w-full px-6 py-3 rounded-xl border border-slate-200 
                         focus:outline-none focus:ring-2 focus:ring-green-100
                         focus:border-green-600 placeholder-slate-400
                         bg-white/90 backdrop-blur-sm shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 p-1 hover:bg-slate-100 rounded-full"
              >
                <svg
                  className="h-6 w-6 text-slate-400"
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

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 
                         focus:outline-none focus:ring-2 focus:ring-green-100
                         focus:border-green-600 bg-white/90 backdrop-blur-sm"
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
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">Vendor:</label>
              <select
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 
                         focus:outline-none focus:ring-2 focus:ring-green-100
                         focus:border-green-600 bg-white/90 backdrop-blur-sm"
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
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-600">Price Range:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-20 px-3 py-2 rounded-lg border border-slate-200 
                           focus:outline-none focus:ring-2 focus:ring-green-100
                           focus:border-green-600"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-20 px-3 py-2 rounded-lg border border-slate-200 
                           focus:outline-none focus:ring-2 focus:ring-green-100
                           focus:border-green-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
      </main>
    </div>
  );
};

export default MarketPlace;
