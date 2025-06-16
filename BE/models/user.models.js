import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      index: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: function () {
        return this.provider === "email";
      },
      select: false, // default tidak dikembalikan
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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
    profileImage: { type: String },
    backgroundImage: { type: String },
    bio: { type: String, maxLength: 150 },
    followers: [{ type: String, ref: "User" }],
    following: [{ type: String, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "News" }],
    marked: [{ type: mongoose.Schema.Types.ObjectId, ref: "News" }],
  },
  { timestamps: true }
);

userSchema.index(
  { userName: "text", fullName: "text", bio: "text" },
  { unique: true }
);

const User = mongoose.model("User", userSchema);
export default User;
