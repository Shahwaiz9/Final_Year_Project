import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MainCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("right");

  const slides = [
    {
      id: 1,
      title: "Discover Nature's Beauty",
      buttonText: "Explore Collection",
      image:
        "https://images.unsplash.com/photo-1470246973918-29a93221c455?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 2,
      title: "Bring Life Indoors",
      buttonText: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
    },
    {
      id: 3,
      title: "Create Your Green Space",
      buttonText: "Get Started",
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
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
    <div className="relative mt-24 h-[500px] md:h-[650px] w-full overflow-hidden">
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
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                {slides[currentSlide].title}
              </h1>
              <button
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 
                           text-white px-8 py-3 rounded-full text-lg md:text-xl 
                           transition-all duration-300 transform hover:scale-105 
                           hover:bg-white/30 shadow-lg hover:shadow-xl"
              >
                {slides[currentSlide].buttonText}
              </button>
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full 
                 transition-colors duration-300"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-3 rounded-full 
                 transition-colors duration-300"
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
};

export default MainCarousel;
