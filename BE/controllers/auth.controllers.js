import admin from "../config/firebase.js";
import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import { exchangeCustomTokenForIdToken } from "../service/idToken.js";

export const registerWithEmail = async (req, res) => {
  try {
    const { email, password, userName, fullName, role } = req.body;

    // validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    // cek email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is registered" });
    }

    // validasi role
    const roleValidate = ["user", "admin"];
    const userRole = roleValidate.includes(role) ? role : "user";

    // buat akun di firebase
    const [firebaseUser, hashedPassword] = await Promise.all([
      admin.auth().createUser({ email, password }),
      bcrypt.hash(password, 10),
    ]);
    // hash password

    // save ke DB
    const dbStart = Date.now();
    const newUser = new User({
      _id: firebaseUser.uid,
      email,
      password: hashedPassword,
      userName,
      fullName,
      role: userRole,
      provider: "email",
    });

    await newUser.save();

    res.status(200).json({ message: "User successfully register" });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: `failed to register: ${error.message}` });
  }
};

export const loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    const startTime = Date.now();
    console.log("Mulai login...");

    // cek user di DB
    const user = await User.findOne({ email }).select("+password");
    console.log("cek email:", Date.now() - startTime, "ms");

    if (!user || !user.password) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    // bandingkan password yang sudah ad di DB dan pembuatan token
    const tokenTime = Date.now();

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    // customToken
    const customToken = await admin
      .auth()
      .createCustomToken(user._id.toString());

    // simpan id token di cookies (bukan custom token lagi)
    const idToken = await exchangeCustomTokenForIdToken(customToken);
    console.log("Token: ", idToken);

    console.log("cek pembuatan token:", Date.now() - tokenTime, "ms");

    res.cookie("authToken", idToken, { httpOnly: true });
    res.json({ message: "Login successfully" });
  } catch (error) {
    console.log("login error:", error);
    res.status(500).json({ message: `Failed to login: ${error.message}` });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    // verivikasi token firebase
    const decoded = await admin.auth().verifyIdToken(idToken);
    let user = await User.findOne({ _id: decoded.uid });

    if (!user) {
      user = new User({
        _id: decoded.uid,
        email: decoded.email,
        userName: decoded.name || decoded.email.split("@")[0],
        fullName: decoded.name,
        role: "user",
        provider: decoded.firebase.sign_in_provider,
        profileImage: decoded.picture || "",
      });

      await user.save();
    }

    // create token login
    const token = await admin.auth().createCustomToken(user._id);

    res.cookie("authToken", token, { httpOnly: true });
    res.json({ message: "Login succesfully", token });
  } catch (error) {
    console.log("social login error:", error.message);
    res.status(500).json({ message: `Failed to Login ${error.message}` });
  }
};

export const logOut = (req, res) => {
  try {
    res.clearCookie("authToken");
    res.json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to logout" });
  }
};
