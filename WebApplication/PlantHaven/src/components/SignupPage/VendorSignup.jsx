import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaStore,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ Validation schema with confirm password check
const schema = yup.object().shape({
  CompanyName: yup.string().required("Company name is required"),
  CompanyAddress: yup
    .string()
    .min(10, "Company address must be at least 10 characters")
    .required("Company address is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
  contact: yup
    .string()
    .matches(/^03\d{9}$/, "Contact must start with 03 and be 11 digits")
    .required("Contact number is required"),
});

export default function VendorSignup() {
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
    const { confirmPassword, ...payload } = data; // remove confirmPassword before sending

    try {
      const response = await fetch("http://localhost:5000/auth/signup/vendor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError("apiError", {
          message: result.message || "Signup failed. Please try again.",
        });
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          CompanyName: data.CompanyName,
          email: data.email,
          role: "vendor",
        })
      );
      localStorage.setItem("authToken", result.jwtToken);

      setTimeout(() => {
        navigate("/vendor-homepage");
      }, 1000);
    } catch (e) {
      console.error(e);
      setError("apiError", { message: "An error occurred. Please try again." });
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
          Vendor Signup
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {/* Company Name */}
          <div className="relative w-full">
            <FaStore className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("CompanyName")}
              type="text"
              placeholder="Company Name"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400"
            />
            {errors.CompanyName && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.CompanyName.message}
              </p>
            )}
          </div>

          {/* Company Address */}
          <div className="relative w-full">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("CompanyAddress")}
              type="text"
              placeholder="Company Address"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400"
            />
            {errors.CompanyAddress && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.CompanyAddress.message}
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
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400"
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
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400"
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
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="relative w-full">
            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              {...register("contact")}
              type="text"
              placeholder="Contact Number (03XXXXXXXXX)"
              className="w-full py-3 pl-12 pr-4 bg-transparent text-white rounded-lg border border-gray-400"
            />
            {errors.contact && (
              <p className="text-red-500 text-sm mt-1 ml-1">
                {errors.contact.message}
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
