import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      ref: "User",
      required: true,
    },
    to: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["follow", "like", "comment", "replyComment", "marked"],
      required: true,
    },
    newsId: {
      type: String,
      required: function () {
        return this.type !== "follow"; // newsId itu untuk like/comments
      },
      index: true,
    },
    commentId: { type: String, index: true },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ to: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
