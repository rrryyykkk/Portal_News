import admin from "../config/firebase.js";
import User from "../models/user.models.js";

export const verifyCookieToken = async (req, res, next) => {
  try {
    // pastikan req.cookies.authToken tersedia
    const token =
      req.cookies?.authToken ||
      (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    // verifikasi token dari firebase
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded || !decoded.uid)
      return res.status(401).json({ message: "Unauthorized: Invalid Token" });

    // cek user ada di DB
    const user = await User.findById(decoded.uid);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Firebase token error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unathorized: User not authenticated" });
    }
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access requiered" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
