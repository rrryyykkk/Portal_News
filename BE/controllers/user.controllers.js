import admin from "../config/firebase.js";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";
import {
  downloadAndUploadImage,
  isValidImageUrl,
  uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";
import bcrypt from "bcrypt";

export const getProfile = (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("Profile Error:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch profile", error: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const {
      userName,
      fullName,
      password,
      newPassword,
      email,
      bio,
      profileImage,
      backgroundImage,
    } = req.body;

    console.log("req.body:-editProfile", req.body);

    const user = await User.findById(req.user._id).select("+password");
    console.log("user:-editProfile", user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password) user.password = await bcrypt.hash(password, 10);

    // edit email di firebase + mongodb

    if (email && email !== user.email) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email))
        return res.status(400).json({ message: "Invalid email" });

      await admin.auth().updateUser(user._id, { email });
      user.email = email;
    }

    // edit password di firebase + mongoDB

    if (password && newPassword) {
      const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!regexPassword.test(newPassword))
        return res.status(400).json({
          message:
            "Password must include uppercase, lowercase, number, symbol, and be at least 8 characters",
        });

      if (password === newPassword) {
        return res.status(400).json({
          message: "New password must be different from current password",
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // firebase
      await admin.auth().updateUser(user._id, { password: newPassword });

      // mongoDb
      user.password = await bcrypt.hash(newPassword, 10);
    }

    // upload profileImage
    if (profileImage && profileImage.startsWith("data:image/")) {
      const mime = profileImage.match(/^data:(.+);base64,/)[1];
      const base64Data = profileImage.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const result = await uploadToCloudinary(buffer, "profiles", mime);
      user.profileImage = result.secure_url;
    }

    // upload background
    if (backgroundImage && backgroundImage.startsWith("data:image/")) {
      const mime = backgroundImage.match(/^data:(.+);base64,/)[1];
      const base64Data = backgroundImage.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const result = await uploadToCloudinary(buffer, "profiles", mime);
      user.backgroundImage = result.secure_url;
    }

    if (userName) user.userName = userName;
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;

    await user.save();
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: " Edit profile failed:", error: error.message });
    console.log("Edit Profile Error:", error.message);
  }
};

export const followUnFollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (id === userId) {
      return res.status(400).json({ error: " You can't follow/unfollow " });
    }

    // ambil informasi user yang akan di-follow/unfollow
    const [targetUser, currentUser] = await Promise.all([
      User.findById(id).lean(),
      User.findById(userId).lean(),
    ]);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // aturan follow/unfollow
    if (currentUser.role === "user" && targetUser.role !== "admin") {
      return res.status(403).json({ error: "User can only follow admins" });
    }
    if (currentUser.role === "admin" && targetUser.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Admins can only follow other admins" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow
      await Promise.all([
        User.findByIdAndUpdate(id, {
          $pull: { followers: userId },
        }),
        User.findByIdAndUpdate(userId, {
          $pull: { following: id },
        }),
        new Notification({
          type: "follow",
          from: id,
          to: userId,
        }).save(),
      ]);

      res.status(200).json({ message: "Unfollow successfully", userId: id });
    }
    // follow
    else {
      await Promise.all([
        User.findByIdAndUpdate(id, {
          $addToSet: { followers: userId },
        }),
        User.findByIdAndUpdate(userId, {
          $addToSet: { following: id },
        }),
        // buat Notification
        new Notification({
          type: "follow",
          from: userId,
          to: id,
        }).save(),
      ]);

      res.status(200).json({ message: "followed successfully", userId: id });
    }
  } catch (error) {
    console.error(" error in followUnFollow:", error);
    res.status(500).json({ error: error.message });
  }
};

// hanya admin yang bisa
export const followers = async (req, res) => {
  try {
    const adminId = req.user._id;
    const admin = await User.findById(adminId).select("followers").lean();

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const followers = await User.find(
      { _id: { $in: admin.followers } },
      "_id userName profileImage"
    ).lean();

    res.json(followers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to manage Followers", error: error.message });
  }
};
