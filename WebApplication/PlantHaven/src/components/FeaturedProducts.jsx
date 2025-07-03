import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const [productSets, setProductSets] = useState([]);
  const [currentSet, setCurrentSet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Auto-rotate interval in milliseconds
  const AUTO_ROTATE_INTERVAL = 3000;

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/product/featured/featured-products"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch featured products");
        }
        const data = await response.json();

        const shuffledProducts = [...data.products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);

        const sets = [];
        for (let i = 0; i < shuffledProducts.length; i += 3) {
          sets.push(shuffledProducts.slice(i, i + 3));
        }

        setProductSets(sets);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Auto-rotate logic
  useEffect(() => {
    if (productSets.length <= 1 || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentSet((prev) => (prev === productSets.length - 1 ? 0 : prev + 1));
    }, AUTO_ROTATE_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [productSets.length, isPaused]);

  const nextSet = () => {
    setCurrentSet((prev) => (prev === productSets.length - 1 ? 0 : prev + 1));
    resetTimer();
  };

  const prevSet = () => {
    setCurrentSet((prev) => (prev === 0 ? productSets.length - 1 : prev - 1));
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentSet((prev) =>
          prev === productSets.length - 1 ? 0 : prev + 1
        );
      }, AUTO_ROTATE_INTERVAL);
    }
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-[#2C5F5F] to-[#1A4848]">
        <div className="container mx-auto px-4 text-center text-white">
          Loading featured products...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-[#2C5F5F] to-[#1A4848]">
        <div className="container mx-auto px-4 text-center text-white">
          Error: {error}
        </div>
      </section>
    );
  }

  if (productSets.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-[#2C5F5F] to-[#1A4848]">
        <div className="container mx-auto px-4 text-center text-white">
          No featured products available
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-16 bg-gradient-to-br from-[#2C5F5F] to-[#1A4848]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-22">
        <h2 className="text-3xl font-bold text-center text-[#68d391] mb-12 drop-shadow-lg">
          Featured Products
        </h2>

        <div className="relative">
          {productSets.length > 1 && (
            <>
              <button
                onClick={prevSet}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 rounded-full 
                         backdrop-blur-lg hover:bg-white/20 transition-colors duration-300 z-10"
                aria-label="Previous products"
              >
                ←
              </button>
              <button
                onClick={nextSet}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-3 rounded-full 
                         backdrop-blur-lg hover:bg-white/20 transition-colors duration-300 z-10"
                aria-label="Next products"
              >
                →
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSet}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-20"
            >
              {productSets[currentSet].map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>

          {productSets.length > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {productSets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSet(index);
                    resetTimer();
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSet ? "bg-[#68d391] w-6" : "bg-white/30"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
