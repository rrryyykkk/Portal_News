import admin from "../config/firebase.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { exchangeCustomTokenForIdToken } from "../service/idToken.js";
import Joi from "joi";

// Validasi register
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and symbol",
    }),
  userName: Joi.string().alphanum().min(3).required(),
  fullName: Joi.string().min(2).required(),
});

export const registerWithEmail = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email, password, userName, fullName } = req.body;

    const emailLower = email.toLowerCase();
    const userNameLower = userName.toLowerCase();

    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email: emailLower }),
      User.findOne({ userName: userNameLower }),
    ]);

    if (existingEmail)
      return res.status(400).json({ message: "Email already registered" });

    if (existingUsername)
      return res.status(400).json({ message: "Username already taken" });

    const [firebaseUser, hashedPassword] = await Promise.all([
      admin.auth().createUser({ email: emailLower, password }),
      bcrypt.hash(password, 12),
    ]);

    const newUser = new User({
      _id: firebaseUser.uid,
      email: emailLower,
      password: hashedPassword,
      userName: userNameLower,
      fullName,
      role: "user",
      provider: "email",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "auth/email-already-exists") {
      return res
        .status(400)
        .json({ message: "Email already registered (Firebase)" });
    }

    console.error("Register error:", err);
    res.status(500).json({ message: "Failed to register" });
  }
};

export const loginWithEmail = async (req, res) => {
  try {
    const { idToken } = req.body;

    // verifikasi token dari firebase
    const decoded = await admin.auth().verifyIdToken(idToken);

    // cek jika uid tidak ada
    if (!decoded || !decoded.uid) {
      return res.status(400).json({ message: "Invalid firebase ID token" });
    }

    // cari user berdasarkan uid
    const user = await User.findOne({ _id: decoded.uid });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // buat session cookie
    const expiresIn = 2 * 60 * 60 * 1000; // 2 jam
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn,
    });

    res.cookie("authToken", sessionCookie, {
      httpOnly: true,
      secure: false, // ganti true saat deploy HTTPS
      sameSite: "Strict",
      maxAge: expiresIn,
    });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
        provider: user.provider,
        profileImage: user.profileImage,
        backgroundImage: user.backgroundImage,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    const decoded = await admin.auth().verifyIdToken(idToken);

    let user = await User.findById(decoded.uid);
    if (!user) {
      const userNameLower = decoded.name
        ? decoded.name.toLowerCase().replace(/\s+/g, "")
        : decoded.email.split("@")[0].toLowerCase();

      user = new User({
        _id: decoded.uid,
        email: decoded.email.toLowerCase(),
        userName: userNameLower,
        fullName: decoded.name || "User",
        role: "user",
        provider: decoded.firebase.sign_in_provider,
        profileImage: decoded.picture || "",
      });

      await user.save();
    }

    const customToken = await admin.auth().createCustomToken(user._id);
    const refreshedIdToken = await exchangeCustomTokenForIdToken(customToken);

    res.cookie("authToken", refreshedIdToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({
      message: "Social login successful",
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        fullName: user.fullName,
        role: user.role,
        provider: user.provider,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Social login error:", err);
    res.status(500).json({ message: "Failed to login via social" });
  }
};

export const logOut = (req, res) => {
  try {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to logout" });
  }
};
