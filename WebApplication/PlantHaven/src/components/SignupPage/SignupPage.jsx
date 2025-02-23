import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaStore } from "react-icons/fa";

export default function SignupPage() {
  const [userData,setuserData]=useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errorMsg,setErrorMsg]= useState("")
  const navigate=useNavigate();

  const handlechange=(e)=>{
    const {name,value}=e.target;
    console.log(name,value)
    const SignUpInfo={...userData}
    SignUpInfo[name]=value
    setuserData(SignUpInfo)
    setErrorMsg("")
  }

  const handlesubmit=async (e)=>{
    e.preventDefault();
    const {name,email,password,confirmPassword}=userData
    console.log(password)
    console.log(confirmPassword)
    console.log(password!=confirmPassword)
    
    if(password!=confirmPassword) {
      setErrorMsg("Password and Confirm Password fields do not match")
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/auth/signup/user',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({name,email,password})
      })
      const data = await response.json()
      if (!response.ok) {
        setErrorMsg(data.message || "Signup failed. Please check your input.");
        return;
      }
      localStorage.setItem("user", JSON.stringify({ name, email, role: "user" }));
      localStorage.setItem("authToken", data.jwtToken);
      
      setTimeout(() => {
        navigate("/");
      }, 1000);
      
      console.log(data)
    }
    catch(e){
      console.log(e)
    }

  }

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat p-4"
      style={{ backgroundImage: "url('/src/assets/loginbg.jpg')" }}
    >
      <div className="border border-gray-300 rounded-2xl p-10 shadow-2xl backdrop-blur-lg bg-white/10 
                      hover:backdrop-blur-xl transition-all duration-300 w-full max-w-md">
        
        <h1 className="text-4xl text-white font-bold text-center mb-6 drop-shadow-md">
          Signup
        </h1>

        <form onSubmit={handlesubmit} className="flex flex-col gap-6">
          <div className="relative w-full">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              onChange={handlechange}
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Your Name"
            />
          </div>
          
          <div className="relative w-full">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              onChange={handlechange}
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
              onChange={handlechange}
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Your Password"
            />
          </div>

          
          <div className="relative w-full">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              onChange={handlechange}
              required
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
              placeholder="Confirm Password"
            />
          </div>
          {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold 
                       transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-blue-500/30 button"
          >
            Signup
          </button>

          <Link
            to="/signup/vendor"
            className="w-full text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl text-lg font-semibold 
                       transition-all duration-300 ease-in-out shadow-md hover:shadow-lg hover:shadow-green-500/30 button"
          >
            <FaStore className="inline-block mr-2"/> Signup as Vendor
          </Link>

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
