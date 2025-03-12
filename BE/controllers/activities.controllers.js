import Comment from "../models/comment.model.js";
import News from "../models/news.models.js";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";

export const likeUnlike = async (req, res) => {
  try {
    const { userId, newsId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const index = user.likes.indexOf(newsId);
    if (index === -1) {
      user.likes.push(newsId);

      // nambah notification
      if (news.userId !== userId) {
        await Notification.create({
          from: userId,
          to: news.userId,
          type: "like",
          newsId,
          message: `${user.userName} Likes your news`,
        });
      }
    } else {
      user.likes.splice(index, 1);

      // hapus notification
      await Notification.findOneAndDelete({
        from: userId,
        to: news.userId,
        type: "like",
        newsId,
      });
    }

    await user.save();
    res.status(200).json({ message: "likeUnlike toggled", likes: user.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { userId, newsId, text, parentId = null } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const comment = await Comment.create({
      newsId,
      userId,
      text,
      parentId,
    });

    // buat notifikasi
    if (news.userId !== userId) {
      await Notification.create({
        from: userId,
        to: news.userId,
        type: "comment",
        newsId,
        message: `${user.userName} comment on your news:${text}`,
      });
    }

    res.status(200).json({ messaging: "Comment added", comment: comment });
  } catch (error) {
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
