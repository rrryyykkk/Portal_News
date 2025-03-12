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
      enum: ["follow", "like", "comment"],
      required: true,
    },
    newsId: {
      type: String,
      required: function () {
        return this.type !== "follow"; // newsId itu untuk like/comments
      },
    },
    commentId: { type: String },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
