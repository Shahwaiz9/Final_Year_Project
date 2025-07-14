import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaStore } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Name must only contain letters")
    .required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Confirm Password is required"),
});

export default function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    try {
      const response = await fetch("http://localhost:5000/auth/signup/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError("apiError", { message: result.message || "Signup failed." });
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({ name, email, role: "user" })
      );
      localStorage.setItem("authToken", result.jwtToken);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      setError("apiError", { message: "Something went wrong. Try again." });
      console.error(err);
    }
  };

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
          Signup
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Name */}
          <div className="relative w-full">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("name")}
              type="text"
              placeholder="Your Name"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative w-full">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="Your Email"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative w-full">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("password")}
              type="password"
              placeholder="Your Password"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative w-full">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400 
                         focus:border-blue-400 outline-none transition-all duration-300 focus:ring-2 
                         focus:ring-blue-300 placeholder-gray-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* API Error */}
          {errors.apiError && (
            <p className="text-red-500 text-sm text-center">
              {errors.apiError.message}
            </p>
          )}

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
            <FaStore className="inline-block mr-2" /> Signup as Vendor
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
