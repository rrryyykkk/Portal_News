/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/auth/Navbar";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi delay login
    setTimeout(() => {
      setLoading(false);
      console.log("Login berhasil");
    }, 1500);
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Title */}
      <div className="flex justify-center items-center pt-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-semibold text-2xl"
        >
          LOGIN
        </motion.h1>
      </div>

      {/* Form */}
      <div className="flex justify-center mt-8 w-full px-4">
        <motion.form
          onSubmit={onLogin}
          className="flex flex-col w-full max-w-md space-y-6 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
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
              className="border rounded-md p-2 text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label htmlFor="password" className="mb-1 text-sm font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="border rounded-md p-2 text-sm pr-10"
              required
            />
            <span
              onClick={togglePassword}
              className="absolute right-3 top-[35px] cursor-pointer text-gray-500"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>

          {/* Remember me */}
          <div className="flex items-center space-x-2 ">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-black">
              Remember me
            </label>
          </div>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className={`py-2 rounded-md transition font-medium cursor-pointer ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--primary-color)] text-white hover:bg-red-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </motion.button>

          {/* Extra links */}
          <div className="text-center text-sm text-black mt-4">
            <p className="underline cursor-pointer mb-2">
              Forgot your password?
            </p>
            <p>
              Don’t have an account?{" "}
              <a
                href="/register"
                className="underline font-medium hover:text-[var(--primary-color)]"
              >
                Sign up
              </a>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
