import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const productSets = [
    [
      {
        id: 1,
        name: "Fertlizer",
        price: "$24.99",
        description: "Nitro Based NPK Fertilizer",
        image:
          "https://risso-chemical.com/wp-content/uploads/2024/04/Bulk-Blending-Fertilizer.png",
      },
      {
        id: 2,
        name: "Afcagari Fetilizer",
        price: "$29.99",
        description: "Special Fertilizer Class 56",
        image:
          "https://www.flowerscambridge.co.uk/upload/mt/tmf205/products/th_null-plant-care-kit-2.jpg",
      },
      {
        id: 3,
        name: "Lawn Booster Prime",
        price: "$49.99",
        description: "Lawn Booster Fertilizer 30-0-0",
        image:
          "https://ikesproducts.com/wp-content/uploads/2021/06/Ikes-Product-LawnBooster-Product-2022.png",
      },
    ],
    [
      {
        id: 4,
        name: "GoPure House Plants",
        price: "$399.99",
        description: "Organic House Plant Care Bundle",
        image:
          "https://andermattgarden.co.uk/cdn/shop/products/GROPUREHOUSEPLANTS500MLTRANSPARENT_1f8b2210-6c47-4ec6-9929-5654d6582abb_1293x.png?v=1680794140",
      },
      {
        id: 5,
        name: "Seasol Foilar Spray",
        price: "$19.99",
        description: "Seasol Foliar Spray | Boost Plant Growth & Health",
        image:
          "https://www.seasol.com.au/wp-content/uploads/2016/09/Seaso-Foliar-Spray-website.png",
      },
      {
        id: 6,
        name: "Pesticide",
        price: "$59.99",
        description: "Pesticide",
        image:
          "https://orangeprotection.com.pk/cdn/shop/files/Machis.png?v=1706722680&width=550",
      },
    ],
  ];

  const [currentSet, setCurrentSet] = useState(0);

  const nextSet = () => {
    setCurrentSet((prev) => (prev === productSets.length - 1 ? 0 : prev + 1));
  };

  const prevSet = () => {
    setCurrentSet((prev) => (prev === 0 ? productSets.length - 1 : prev - 1));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-[#2C5F5F] to-[#1A4848]">
      {/* Fluid Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-22">
        <h2 className="text-3xl font-bold text-center text-[#68d391] mb-12 drop-shadow-lg">
          Featured Products
        </h2>

        {/* Product Cards */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSet}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 rounded-full 
                     backdrop-blur-lg hover:bg-white/20 transition-colors duration-300 z-10"
          >
            ←
          </button>
          <button
            onClick={nextSet}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 rounded-full 
                     backdrop-blur-lg hover:bg-white/20 transition-colors duration-300 z-10"
          >
            →
          </button>

          {/* Product Set */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSet}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {productSets[currentSet].map((product) => (
                <div
                  key={product.id}
                  className="relative group backdrop-blur-lg bg-white/10 rounded-xl p-6 
                           border border-white/20 hover:border-[#68d391]/50 transition-all 
                           duration-300 hover:shadow-2xl hover:shadow-[#276749]/30 flex flex-col justify-around"
                >
                  <div className="overflow-hidden rounded-lg flex flex-col items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-50 lg:h-64 object-cover transform group-hover:scale-105 
                               transition-transform duration-300"
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-white mt-6">
                    {product.name}
                  </h3>
                  <p className="text-[#c6f6d5]/80">{product.description}</p>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-2xl font-bold text-[#68d391]">
                      {product.price}
                    </span>
                    <Link
                      to="/marketplace"
                      className="px-6 py-2 bg-[#276749] text-white rounded-lg 
                                 hover:bg-[#68d391] hover:text-[#1A4848] transition-colors 
                                 duration-300 border border-[#68d391]/30"
                    >
                      Buy Now
                    </Link>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none 
                                group-hover:opacity-100 opacity-0 transition-opacity 
                                duration-300"
                  >
                    <div
                      className="absolute -inset-[2px] bg-gradient-to-r from-[#68d391]/20 
                                  to-[#276749]/20 rounded-xl blur-sm"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
