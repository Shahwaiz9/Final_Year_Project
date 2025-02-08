import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaStore } from "react-icons/fa";

export default function VendorSignup() {
  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/src/assets/loginbg.jpg')" }}
    >
      <div className="border border-gray-300 rounded-2xl p-10 shadow-2xl backdrop-blur-lg bg-white/10 
                      hover:backdrop-blur-xl transition-all duration-300 w-full max-w-md">
        
        <h1 className="text-4xl text-white font-bold text-center mb-6 drop-shadow-md">
          Vendor Signup
        </h1>

        <form className="flex flex-col gap-6">
          <div className="relative w-full">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Your Name"
            />
          </div>
          
          <div className="relative w-full">
            <FaStore className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Store Name"
            />
          </div>
          
          <div className="relative w-full">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Your Email"
            />
          </div>

          <div className="relative w-full">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Your Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-semibold 
                       transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-green-500/30 button"
          >
            Signup as Vendor
          </button>

          <p className="text-center text-slate-300">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-400 font-medium ml-1 underline-offset-4 
                         hover:underline transition-colors duration-200 color"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
