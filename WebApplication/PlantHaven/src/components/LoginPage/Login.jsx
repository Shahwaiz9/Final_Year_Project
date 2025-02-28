import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = userData;

    try {
      const response = await fetch("http://localhost:5000/auth/login/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ name:data.name,email, role: data.role }));
      localStorage.setItem("authToken", data.jwtToken);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error(error);
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
          Login
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

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
