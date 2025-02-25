import MainCarousel from "../MainCarousel";
import AboutSection from "../AboutSection";
import FeaturedProducts from "../FeaturedProducts";

const Homepage = () => {
  return (
    <div>
      <MainCarousel />
      <FeaturedProducts />
      <AboutSection />
    </div>
  );
};

export default Homepage;
