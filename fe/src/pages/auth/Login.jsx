/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/auth/Navbar";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useAuthStore } from "../../app/store/useAuthStore";
import { useToastStore } from "../../app/store/useToastStore";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});

  const loginUser = useAuthStore((state) => state.login);
  const setToast = useToastStore((state) => state.setToast);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onLogin = async (e) => {
    e.preventDefault();

    const newError = {};
    if (!formData.email) {
      newError.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newError.email = "Invalid email format";
    }
    if (!formData.password) {
      newError.password = "Password is required";
    }
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }

    setLoading(true);
    setError({});

    try {
      await loginUser(formData);
      const me = useAuthStore.getState().user;
      if (me) {
        setToast({ message: "Login successfully", type: "success" });
        navigate(from, { replace: true });
      }
    } catch (err) {
      setToast({
        message: "Login failed, please check your Email or Password",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const goHome = () => navigate("/");

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Title */}
      <div className="flex justify-center items-center pt-10 flex-col">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-semibold text-2xl dark:text-white"
        >
          LOGIN
        </motion.h1>

        {/* Back to Home Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={goHome}
          className="mt-4 text-sm text-[var(--primary-color)] hover:underline transition cursor-pointer"
        >
          ← Back to Home
        </motion.button>
      </div>

      {/* Form */}
      <div className="flex justify-center mt-8 w-full px-4">
        <motion.form
          onSubmit={onLogin}
          className="flex flex-col w-full max-w-md space-y-6 relative bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-sm font-medium dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="border rounded-md p-2 text-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label
              htmlFor="password"
              className="mb-1 text-sm font-medium dark:text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              className="border rounded-md p-2 text-sm pr-10 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={togglePassword}
              className="absolute right-3 top-[35px] cursor-pointer text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </span>
          </div>

          {/* Remember me */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="remember"
              className="text-sm text-black dark:text-white"
            >
              Remember me
            </label>
          </div>

          {/* Error Message */}
          {Object.keys(error).length > 0 && (
            <div className="text-red-500 text-sm text-center space-y-1">
              {Object.values(error).map((err, index) => (
                <p key={index}>{err}</p>
              ))}
            </div>
          )}

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
          <div className="text-center text-sm text-black dark:text-white mt-4">
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
