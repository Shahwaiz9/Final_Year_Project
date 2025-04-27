import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/product/featured/featured-products');
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    setProducts([]);
                    setError('Unexpected response format');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch featured products');
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const handleEndFeature = (productId) => {
        // Logic to end feature (you can make an API call here)
        console.log(`Ending feature for product: ${productId}`);
    };

    if (loading) return <div className="text-center mt-10 text-gray-400">Loading...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="p-6 main-container">
            <h1 className="text-3xl font-semibold mb-8 text-white">Featured Products</h1>

            <div className="main-cards">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="card hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out flex flex-col justify-between"
                        style={{ backgroundColor: "#1A4848" }}
                    >
                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={product.image || '/placeholder.jpg'}
                                alt={product.productname}
                                className="h-48 w-full object-cover rounded-md"
                            />
                        </div>

                        <div className="flex flex-col items-center text-center mt-4 px-4 flex-grow">
                            <h3 className="text-lg font-bold text-white mb-2">{product.productname}</h3>
                            <p className="text-gray-400 text-sm mb-3">{product.description}</p>
                            <p className="text-yellow-400 font-semibold text-lg mb-4">Rs. {product.price}</p>
                        </div>

                        {/* End Feature Button */}
                        <div className="flex justify-center mb-4">
                            <button
                                onClick={() => handleEndFeature(product._id)}
                                className="bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 text-sm"
                            >
                                End Feature
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedProducts;
