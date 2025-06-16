/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/auth/Navbar";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { registerToBackend } from "../../app/api/auth";
import { useToastStore } from "../../app/store/useToastStore";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();
  const { setToast } = useToastStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const newError = {};

    if (!formData.firstName) newError.firstName = "First name is required";
    if (!formData.lastName) newError.lastName = "Last name is required";
    if (!formData.userName) newError.userName = "User name is required";
    if (!formData.email) newError.email = "Email is required";
    if (!formData.password) {
      newError.password = "Password is required";
    } else if (formData.password.length < 8) {
      newError.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setLoading(true);
    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      await registerToBackend({
        fullName,
        userName: formData.userName,
        email: formData.email,
        password: formData.password,
      });

      setToast({ message: "Registration successful", type: "success" });
      setFormData({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/login");
    } catch (err) {
      setToast({
        message: err.response?.data?.message || "Registration failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex justify-center items-center mt-10 px-4">
        <motion.div
          className="flex flex-col md:flex-row w-full max-w-5xl shadow-lg rounded-lg overflow-hidden border border-gray-300 min-h-[600px]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left Side */}
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
              {/* Name Fields */}
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
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {error.firstName && (
                    <p className="text-red-500 text-sm">{error.firstName}</p>
                  )}
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
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {error.lastName && (
                    <p className="text-red-500 text-sm">{error.lastName}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="flex flex-col w-full">
                <label htmlFor="userName" className="mb-1 text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="User name"
                  required
                  className="border rounded-md p-2 text-sm"
                  value={formData.userName}
                  onChange={handleChange}
                />
                {error.userName && (
                  <p className="text-red-500 text-sm">{error.userName}</p>
                )}
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
                  value={formData.email}
                  onChange={handleChange}
                />
                {error.email && (
                  <p className="text-red-500 text-sm">{error.email}</p>
                )}
              </div>

              {/* Passwords */}
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
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                  >
                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                  {error.password && (
                    <p className="text-red-500 text-sm">{error.password}</p>
                  )}
                </div>

                <div className="flex flex-col relative w-full">
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 text-sm font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    required
                    className="border rounded-md p-2 text-sm pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-[38px] cursor-pointer text-gray-500"
                  >
                    {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                  </span>
                  {error.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {error.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md transition font-medium cursor-pointer ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[var(--primary-color)] text-white hover:bg-red-600"
                }`}
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>

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
