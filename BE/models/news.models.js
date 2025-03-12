import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
    newsImage: { type: String },
    newsVideo: { type: String },
    category: {
      type: String,
      enum: [
        "Politics",
        "Sport",
        "Technology",
        "Entertainment",
        "Business",
        "Health",
        "Other",
      ],
    },
    source: {
      type: String,
      enum: ["external", "admin"],
      required: true,
      default: "admin",
    },
    externalId: { type: String, default: null }, // id dari mediastack API,jika ada
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);
