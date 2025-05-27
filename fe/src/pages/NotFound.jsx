/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg text-center"
      >
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-purple-500">
          404
        </h1>
        <p className="text-xl mt-4 font-semibold text-gray-800">
          OOPS! Page you're looking for doesn't exist.
        </p>
        <p className="mt-2 text-gray-600">Please use search for help</p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300"
          >
            <FaArrowLeft className="text-sm" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
