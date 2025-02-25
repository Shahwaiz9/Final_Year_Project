import React from "react";

const AboutSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          {/* Image on the Left */}
          <div className="lg:w-1/2">
            <img
              src="https://www.marthastewart.com/thmb/l9ZqEzf_3Jv-2vQriVbYd0WRP1Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/tomato-plants-0722-647d17c25af444288062e5c39d3e115b.jpg" // Replace with your image
              alt="About Us"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Text on the Right */}
          <div className="mt-8 lg:mt-0 lg:w-1/2 lg:pl-12">
            <h2 className="text-3xl font-bold text-gray-900">
              About PlantHaven
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Welcome to <strong>PlantHaven</strong>, your one-stop destination
              for all things related to plant care and health. Our mission is to
              help you nurture your plants and keep them thriving.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              We’ve developed an{" "}
              <strong>AI-powered disease detection model</strong> that can
              identify common plant diseases with high accuracy. Simply upload a
              photo of your plant, and our system will provide you with a
              diagnosis and recommended solutions.
            </p>
            <p className="mt-4 text-lg text-gray-600">
              In addition, our <strong>marketplace</strong> offers a wide range
              of plant care products, including fertilizers, pesticides, and
              tools, to help you maintain a healthy and vibrant garden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
