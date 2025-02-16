import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/src/assets/loginbg.jpg')" }}
    >
      <div
        className="border border-gray-300 rounded-2xl p-10 shadow-2xl backdrop-blur-lg bg-white/10 
                      hover:backdrop-blur-xl transition-all duration-300 w-full max-w-md"
      >
        <h1 className="text-4xl text-white font-bold text-center mb-6 drop-shadow-md">
          Login
        </h1>

        <form className="flex flex-col gap-6">
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
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold 
                       transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-blue-500/30 button"
          >
            Login
          </button>

          <p className="text-center text-slate-300">
            Don't have an account?
            <Link
              to="/signup/user"
              className="text-blue-300 hover:text-blue-400 font-medium ml-1 underline-offset-4 
                         hover:underline transition-colors duration-200 color"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
