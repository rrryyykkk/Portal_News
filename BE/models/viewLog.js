import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema(
  {
    newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
    userId: { type: String, ref: "User" },
    ip: { type: String },
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("ViewLog", viewLogSchema);
