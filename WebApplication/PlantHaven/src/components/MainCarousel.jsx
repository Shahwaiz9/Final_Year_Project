import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const MainCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  const slides = [
    {
      id: 1,
      title: "AI Powered Disease Detection",
      buttonText: "Detect Disease",
      image:
        "https://sharadpawaragricollege.com/wp-content/uploads/2023/05/agricultural-1-1536x864.jpg",
      path: "/detect-disease", // Add path for this slide
    },
    {
      id: 2,
      title: "A vast MarketPlace for all your Plantcare needs",
      buttonText: "Visit MarketPlace",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2288610413/display_1500/stock-photo-flower-shop-with-decor-augsburg-in-the-city-castrop-rauxel-germany-2288610413.jpg",
      path: "/shop", // Add path for this slide
    },
    {
      id: 3,
      title: "Become a Vendor",
      buttonText: "Join Us",
      image:
        "https://www.shutterstock.com/shutterstock/photos/2412962849/display_1500/stock-photo-local-farmers-managing-a-family-business-offering-sustainable-farm-products-for-sale-portrait-of-2412962849.jpg",
      path: "/get-started", // Add path for this slide
    },
  ];

  const nextSlide = () => {
    setDirection("right");
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection("left");
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? "right" : "left");
    setCurrentSlide(index);
  };

  useEffect(() => {
    const autoRotate = setInterval(nextSlide, 5000);
    return () => clearInterval(autoRotate);
  }, [currentSlide]);

  const variants = {
    enter: (direction) => ({
      x: direction === "right" ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === "right" ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-[500px] md:h-[730px] w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg max-w-[70%] mx-auto">
                {slides[currentSlide].title}
              </h1>
              {/* Wrap the button with Link */}
              <Link to={slides[currentSlide].path}>
                <button
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 
                           text-white px-8 py-3 rounded-full text-lg md:text-xl 
                           transition-all duration-300 transform hover:scale-105 
                           hover:bg-white/30 shadow-lg hover:shadow-xl"
                >
                  {slides[currentSlide].buttonText}
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-green-500 w-6" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 bg-white/50 hover:bg-white/70 p-3 pt-2 rounded-full 
                 transition-colors duration-300 text-xl"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 bg-white/50 hover:bg-white/70 p-3 pt-2 rounded-full 
                 transition-colors duration-300 text-xl"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
};

export default MainCarousel;
