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
        "general",
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
    userId: {
      type: String,
      ref: "User",
    },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    trendyScore: { type: Number, default: 0 },
    viewsLatest: { type: Number, default: 0 },
  },
  { timestamps: true }
);

newsSchema.index({ title: "text", description: "text", category: "text" });

newsSchema.index({
  userId: 1,
});

export default mongoose.model("News", newsSchema);
