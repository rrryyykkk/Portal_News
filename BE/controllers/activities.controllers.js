import { query } from "express";
import Comment from "../models/comment.model.js";
import News from "../models/news.models.js";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";
import mongoose from "mongoose";

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
    const userId = req.user._id;
    const { newsId } = req.params;

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

    res.status(200).json({ message: "Comment added", comment: comment });
  } catch (error) {
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
      res.status(404).json({ message: "Comment not found" });
    }

    if (comment.userId !== userId) {
      res.status(404).json({ message: "Unauthorized" });
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

    console.log("parentId:", parentId);
    console.log("req body:", req.body);

    if (!parentId) {
      return res.status(400).json({ message: "Parent Id is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parentComment = await Comment.findById(parentId);
    console.log("parentComment:", parentComment);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const news = await News.findById(newsId);
    console.log("news:", news);
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
        newsId,
        type: "replyComment",
        message: `${user.userName} replied to your comment: ${text}`,
      });
    }

    res.status(200).json({ message: "Reply added", comment });
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

export const markedNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId });
    console.log("user:", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const news = await News.findById(newsId);
    console.log("news:", news);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const index = user.marked.indexOf(newsId);
    console.log("index", index);
    if (index === -1) {
      user.marked.push(newsId);

      // nambah notification
      if (news.userId !== userId)
        console.log("Perbandingan:", news.userId === userId);
      {
        await Notification.create({
          from: userId,
          to: news.userId,
          type: "marked",
          newsId,
          message: `${user.userName} Marked your news`,
        });
        console.log("Notification:", Notification.create);
      }
    } else {
      user.marked.splice(index, 1);

      // hapus notification
      await Notification.findOneAndDelete({
        from: userId,
        to: news.userId,
        type: "marked",
        newsId,
      });
    }
    await user.save();
    res.status(200).json({ message: "marked active", marked: user.marked });
    console.log("marked:", user.marked);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
