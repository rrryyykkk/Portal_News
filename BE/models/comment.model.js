import mongoose from "mongoose";

const commentSchema = new mongoose.model(
  {
    newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true, trim },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
