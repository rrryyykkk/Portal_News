import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    newsId: { type: String, ref: "News" },
    userId: { type: String, ref: "User" },
    text: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
