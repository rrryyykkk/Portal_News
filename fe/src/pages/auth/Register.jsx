/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/auth/Navbar";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("Register berhasil");
    }, 1500);
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Container */}
      <div className="flex justify-center items-center mt-10 px-4">
        <motion.div
          className="flex flex-col md:flex-row w-full max-w-5xl shadow-lg rounded-lg overflow-hidden border border-gray-300 min-h-[600px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Side: Image */}
          <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100">
            <img
              src="/logo/logo.png"
              alt="Register Illustration"
              className="w-40 md:w-full h-auto object-contain p-4 md:p-8"
            />
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-8 bg-white flex flex-col justify-center">
            <h2
              className="text-2xl font-semibold mb-6 text-center"
              style={{
                fontFamily: "var(--font-h1)",
                fontSize: "var(--size-h1)",
              }}
            >
              Register
            </h2>

            <form onSubmit={onRegister} className="space-y-5">
              {/* Name */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="firstName"
                    className="mb-1 text-sm font-medium"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    required
                    className="border rounded-md p-2 text-sm"
                    style={{
                      fontFamily: "var(--font-input)",
                      fontSize: "var(--size-input)",
                    }}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="lastName"
                    className="mb-1 text-sm font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    required
                    className="border rounded-md p-2 text-sm"
                    style={{
                      fontFamily: "var(--font-input)",
                      fontSize: "var(--size-input)",
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="border rounded-md p-2 text-sm"
                  style={{
                    fontFamily: "var(--font-input)",
                    fontSize: "var(--size-input)",
                  }}
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col relative w-full">
                  <label
                    htmlFor="password"
                    className="mb-1 text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Create password"
                    required
                    className="border rounded-md p-2 text-sm pr-10"
                    style={{
                      fontFamily: "var(--font-input)",
                      fontSize: "var(--size-input)",
                    }}
                  />
                  <span
                    onClick={togglePassword}
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </div>

                <div className="flex flex-col relative w-full">
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    required
                    className="border rounded-md p-2 text-sm pr-10"
                    style={{
                      fontFamily: "var(--font-input)",
                      fontSize: "var(--size-input)",
                    }}
                  />
                  <span
                    onClick={togglePassword}
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md transition font-medium ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--primary-color)] text-white hover:bg-red-600"
                }`}
                style={{
                  fontFamily: "var(--font-button)",
                  fontSize: "var(--size-button)",
                }}
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>

              {/* Link to login */}
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="underline font-medium hover:text-[var(--primary-color)]"
                >
                  Login
                </a>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
