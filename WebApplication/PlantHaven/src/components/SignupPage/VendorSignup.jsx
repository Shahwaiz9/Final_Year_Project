import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaStore, FaMapMarkerAlt, FaPhone } from "react-icons/fa";

export default function VendorSignup() {
  const [vendorData, setVendorData] = useState({
    CompanyName: "",
    CompanyAddress: "",
    email: "",
    password: "",
    contact: "",
  });
  
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({ ...prevData, [name]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { CompanyName, CompanyAddress, email, password, contact } = vendorData;

    try {
      const response = await fetch("http://localhost:5000/auth/signup/vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ CompanyName, CompanyAddress, email, password, contact }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Signup failed. Please check your input.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ CompanyName, email, role: "vendor" }));
      localStorage.setItem("authToken", data.jwtToken);

      setTimeout(()=>{
        navigate("/vendor-homepage");
      },1000)
      
    } catch (e) {
      console.error(e);
      setErrorMsg("An error occurred. Please try again later.");
    }
  };

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

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative w-full">
            <FaStore className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="CompanyName"
              onChange={handleChange}
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Company Name"
            />
          </div>
          
          <div className="relative w-full">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="CompanyAddress"
              onChange={handleChange}
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Company Address"
            />
          </div>
          
          <div className="relative w-full">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              onChange={handleChange}
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
              name="password"
              onChange={handleChange}
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Your Password"
            />
          </div>
          
          <div className="relative w-full">
            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="contact"
              onChange={handleChange}
              required
              pattern="03[0-9]{9}"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Contact Number (03XXXXXXXXX)"
            />
          </div>

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
          
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-semibold 
                       transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-green-500/30"
          >
            Signup as Vendor
          </button>

          <p className="text-center text-slate-300">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-300 hover:text-blue-400 font-medium ml-1 underline-offset-4 
                         hover:underline transition-colors duration-200"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
