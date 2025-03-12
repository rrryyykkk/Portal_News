import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["email", "google", "facebook", "apple"],
      required: true,
    },
    profileImage: {
      type: String,
    },
    backgroundImage: {
      type: String,
    },
    bio: { type: String, maxLength: 150 },
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "News" }],
    marked: [{ type: mongoose.Schema.Types.ObjectId, ref: "News" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
