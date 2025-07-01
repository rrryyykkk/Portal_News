import mongoose, { isValidObjectId } from "mongoose";
import Comment from "../models/comment.model.js";
import News from "../models/news.models.js";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";

export const likeUnlike = async (req, res) => {
  try {
    const { type, targetId } = req.params;
    const userId = req.user._id;

    // Validasi tipe dan ID
    if (!["news", "comment"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (!isValidObjectId(targetId)) {
      return res.status(400).json({ message: "Invalid format id" });
    }

    // Cek user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ambil target dokumen
    const model = type === "news" ? News : Comment;
    const targetDoc = await model.findById(targetId);
    if (!targetDoc) {
      return res.status(404).json({ message: `${type} not found` });
    }

    const hasLiked = user.likes.includes(targetId);
    let notificationPromise = Promise.resolve();

    if (!hasLiked) {
      // Batas maksimal likes
      if (user.likes.length > 1000) {
        return res
          .status(400)
          .json({ message: "You have liked too many items." });
      }

      user.likes.push(targetId);
      targetDoc.likes = (targetDoc.likes || 0) + 1;

      // Kirim notifikasi jika target bukan milik user sendiri
      if (
        targetDoc.userId &&
        targetDoc.userId.toString() !== userId.toString()
      ) {
        notificationPromise = Notification.create({
          from: userId,
          to: targetDoc.userId,
          newsId: type === "news" ? targetId : targetDoc.newsId,
          type: "like",
          message: `${user.userName} liked your ${type}`,
        });
      }
    } else {
      // Batalkan like
      user.likes = user.likes.filter((id) => id.toString() !== targetId);
      targetDoc.likes = Math.max((targetDoc.likes || 1) - 1, 0);

      notificationPromise = Notification.findOneAndDelete({
        from: userId,
        to: targetDoc.userId,
        newsId: type === "news" ? targetId : targetDoc.newsId,
        type: "like",
      });
    }

    await Promise.all([user.save(), targetDoc.save(), notificationPromise]);

    res.status(200).json({
      message: `Successfully toggled like on ${type}`,
      likes: targetDoc.likes,
      liked: !hasLiked,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text, parentId = null } = req.body;
    const userId = req.user._id;
    const { newsId } = req.params;

    const [user, news] = await Promise.all([
      User.findById(userId).lean(),
      News.findById(newsId).lean(),
    ]);

    // cek user dan news
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const commentTime = Date.now();
    const comment = await Comment.create({
      newsId,
      userId,
      text,
      parentId,
    });

    await News.findByIdAndUpdate(newsId, { $inc: { comments: 1 } });

    // buat notifikasi
    if (news.userId && news.userId !== userId) {
      await Notification.create({
        from: userId,
        to: news.userId,
        type: "comment",
        newsId,
        message: `${user.userName} comment on your news:${text}`,
      });
    }

    res.status(200).json({ message: "Comment added", comment: comment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    comment.text = text;
    (comment.edited = true), await comment.save();

    res.status(200).json({ message: "Edit commnet successfully", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const replyComment = async (req, res) => {
  try {
    const { text } = req.body; // Ambil parentId dari req.body
    const userId = req.user._id;
    const { newsId, parentId } = req.params;

    if (!parentId) {
      return res.status(400).json({ message: "Parent Id is required" });
    }

    const [user, parentComment, news] = await Promise.all([
      User.findById(userId),
      Comment.findById(parentId),
      News.findById(newsId),
    ]);

    // cek user dan parent comment
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const comment = await Comment.create({
      newsId,
      userId,
      text,
      parentId,
    });

    await News.findByIdAndUpdate(newsId, { $inc: { comments: 1 } });

    // buat notifikasi
    if (news.userId && news.userId !== userId) {
      await Notification.create({
        from: userId,
        to: news.userId,
        newsId,
        type: "replyComment",
        message: `${user.userName} replied to your comment: ${text}`,
      });
    }

    res.status(200).json({ message: "Reply added", comment });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const { newsId } = req.params;

    // cek apakah ada berita
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // ambil semua comments yang berdasarkan newsId
    const comments = await Comment.find({ newsId })
      .populate("userId", "userName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markedNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(404).json({ message: "Invalid newsId" });
    }

    const [user, news] = await Promise.all([
      User.findById(userId),
      News.findById(newsId),
    ]);

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!news) return res.status(404).json({ message: "News not found" });

    const index = user.marked.findIndex((id) => id === newsId);

    let notificationPromise = Promise.resolve();

    if (index === -1) {
      user.marked.push(newsId);

      if (news.userId && news.userId !== userId) {
        notificationPromise = Notification.create({
          from: userId,
          to: news.userId,
          type: "marked",
          newsId,
          message: `${user.userName} marked your news`,
        });
      }
    } else {
      user.marked.splice(index, 1);

      notificationPromise = Notification.findOneAndDelete({
        from: userId,
        to: news.userId,
        type: "marked",
        newsId,
      });
    }

    await Promise.all([notificationPromise, user.save()]);

    await user.populate({
      path: "marked",
      model: "News", // 🔥 WAJIB kalau pakai ref: String
      select:
        "_id title newsImage newsVideo views likes comments createdAt category description",
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({
      message: "Marked updated",
      marked: user.marked,
    });
  } catch (error) {
    console.error("❌ Marked Error:", error.message);
    res.status(500).json({
      message: "Failed to update marked news",
    });
  }
};
