import mongoose from "mongoose";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";
import {
  donwloadAndUploadImage,
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
    const { userName, fullName, password, bio, profileImage, backgroundImage } =
      req.body;
    console.log("Edit profile req:", req.body);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password) user.password = await bcrypt.hash(password, 10);

    const uploadPromise = [];

    if (req.files?.profileImage) {
      console.log("Uploading profile img.....");
      uploadPromise.push(
        uploadToCloudinary(
          req.files.profileImage.data,
          "profile",
          req.files.profileImage.mimeType
        ).then((url) => (user.profileImage = url))
      );
    } else if (profileImage && !isValidImageUrl(profileImage)) {
      console.log("Donwloading & uploading external profile image....");
      uploadPromise.push(
        donwloadAndUploadImage(profileImage).then(
          (url) => (user.profileImage = url)
        )
      );
    } else if (profileImage) {
      user.profileImage = profileImage;
    }

    if (req.files?.backgroundImage) {
      console.log("Uploading background img.....");
      uploadPromise.push(
        uploadToCloudinary(
          req.files.backgroundImage.data,
          "profile",
          req.files.backgroundImage.mimeType
        ).then((url) => (user.profileImage = url))
      );
    } else if (backgroundImage && !isValidImageUrl(backgroundImage)) {
      console.log("Donwloading & uploading external profile image....");
      uploadPromise.push(
        donwloadAndUploadImage(backgroundImage).then(
          (url) => (user.backgroundImage = url)
        )
      );
    } else if (backgroundImage) {
      user.backgroundImage = backgroundImage;
    }

    if (userName) user.userName = userName;
    if (fullName) user.fullName = fullName;
    if (bio) user.bio = bio;

    console.log("sebelum di save:", user);
    await user.save();
    console.log("sesudah di save:", user);
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: " Edit profile failed:", error: error.message });
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
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const target = await User.findById(req.params.targetUserId);
    if (!target) {
      return res.status(404).json({ message: " User not found" });
    }
    console.log("target:", target);

    target.followers = await User.find({
      _id: { $in: target.followers },
    }).select("userName fullName profileImage");
    console.log("target Followers:", target.followers);

    res.json(target.followers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to manage Followers", error: error.message });
  }
};
