import admin from "../config/firebase.js";
import newsModels from "../models/news.models.js";
import User from "../models/user.models.js";
import dotenv from "dotenv";

dotenv.config();

export const verifyCookieToken = async (req, res, next) => {
  try {
    // pastikan req.cookies.authToken tersedia
    const token = req.cookies?.authToken;
    console.log("token-middleware:", token);
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    // verifikasi token dari firebase
    const decoded = await admin.auth().verifySessionCookie(token, true);
    console.log("decoded:", decoded);

    if (!decoded || typeof decoded.uid !== "string") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // cek user ada di DB
    const user = await User.findById(decoded.uid).select(
      "_id email role fullName userName provider profileImage backgroundImage bio followers following"
    );
    if (!user || typeof user.role !== "string")
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found or invalid" });

    // sanitasi user
    const sanitizedUser = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role.toLowerCase(),
      fullName: user.fullName,
      userName: user.userName,
      provider: user.provider,
      profileImage: user.profileImage,
      backgroundImage: user.backgroundImage,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
    };
    console.log("sanitizedUser:", sanitizedUser);

    Object.freeze(sanitizedUser);

    req.user = sanitizedUser;
    next();
  } catch (error) {
    console.log("Firebase token error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    // sisi dev
    if (process.env.NODE_ENV === "development") {
      {
        req.user = {};
      }
      return next();
    }

    if (
      !req.user ||
      typeof req.user !== "object" ||
      req.user === null ||
      typeof req.user.role !== "string"
    ) {
      return res
        .status(401)
        .json({ message: "Unathorized: Invalid user object" });
    }

    const role = req.user.role.toLowerCase();

    if (role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access only" });
    }

    next();
  } catch (error) {
    console.error("[verifyAdminStrict]", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addViews = async (req, res, next) => {
  try {
    const { newsId } = req.params;
    await newsModels.findByIdAndUpdate(
      newsId,
      { $inc: { views: 1 } }, //Increment Views di berita
      { new: true, runValidators: true } // kembalikan data terbaru setelah update
    );

    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
