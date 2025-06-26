import admin from "../config/firebase.js";
import newsModels from "../models/news.models.js";
import User from "../models/user.models.js";
import dotenv from "dotenv";

dotenv.config();

// ini untuk login
export const verifyCookieToken = async (req, res, next) => {
  try {
    // pastikan req.cookies.authToken tersedia
    const token = req.cookies?.authToken;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });

    // verifikasi token dari firebase
    const decoded = await admin.auth().verifySessionCookie(token, true);

    if (!decoded || typeof decoded.uid !== "string") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // cek user ada di DB
    const user = await User.findById(decoded.uid)
      .select(
        "_id email role fullName userName provider profileImage backgroundImage bio followers following marked"
      )
      .populate({
        path: "marked",
        model: "News",
        select:
          "_id title newsImage newsVideo views likes comments createdAt category description",
        options: { sort: { createdAt: -1 } },
      });
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
      marked: user.marked,
    };

    Object.freeze(sanitizedUser);

    req.user = sanitizedUser;
    next();
  } catch (error) {
    console.log("Firebase token error:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ini untuk non-login
export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken;

    if (!token) return next();

    const decoded = await admin.auth().verifySessionCookie(token, true);

    if (!decoded || typeof decoded.uid !== "string") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // cek user ada di DB
    const user = await User.findById(decoded.uid).select(
      "_id email role fullName userName provider profileImage backgroundImage bio followers following marked"
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
      marked: user.marked,
    };

    Object.freeze(sanitizedUser);

    req.user = sanitizedUser;
    next();
  } catch (error) {
    return next();
  }
};

export const verifyAdmin = (req, res, next) => {
  try {
    // sisi dev
    if (process.env.NODE_ENV === "development") {
      {
        req.user = {
          _id: req.user._id,
          role: req.user.role,
          fullName: req.user.fullName,
          userName: req.user.userName,
          profileImage: req.user.profileImage,
        };
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
    console.error("[verifyAdminStrict]", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
