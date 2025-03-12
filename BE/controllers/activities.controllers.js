import { query } from "express";
import Comment from "../models/comment.model.js";
import News from "../models/news.models.js";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";

export const likeUnlike = async (req, res) => {
  try {
    const { newsId } = req.params;
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const news = await News.findById(newsId);
    console.log("newsID", news);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const index = user.likes.indexOf(newsId);
    const newsUserId = await News.findOne({ userId: userId.toString() });
    console.log("newsUserId", newsUserId);
    if (index === -1) {
      user.likes.push(newsId);

      // nambah notification
      if (news.userId !== userId)
        console.log("Perbandingan:", news.userId === userId);
      {
        await Notification.create({
          from: userId,
          to: news.userId,
          type: "like",
          newsId,
          message: `${user.userName} Likes your news`,
        });
        console.log("Notification:", Notification.create);
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
    const { text, parentId = null } = req.body;
    const userId  = req.user._id;
    const { newsId } = req.params;
    console.log("req body:", req.body);
    console.log("query:", query);
    console.log("userId:", userId);
    console.log("newsId:", newsId);

    const user = await User.findById(userId);
    console.log("user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("News:", News());
    const news = await News.findById(newsId);
    console.log("news:", news, "type:", typeof _id);
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
      console.log("news.user:", news.userId);
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
