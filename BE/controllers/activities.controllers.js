import Comment from "../models/comment.model.js";
import News from "../models/news.models.js";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";

export const likeUnlike = async (req, res) => {
  try {
    const { newsId } = req.params;
    const userId = req.user._id;

    const startTime = Date.now();
    console.log(`Mulai likeUnlike...: ${startTime}ms`);

    const userTime = Date.now();
    const newsTime = Date.now();
    const [user, news] = await Promise.all([
      User.findById(userId),
      News.findById(newsId),
    ]);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("cek user:", Date.now() - userTime, "ms");

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    console.log("cek news:", Date.now() - newsTime, "ms");

    const indexTime = Date.now();
    const index = user.likes.indexOf(newsId);
    let notificationPromise = Promise.resolve();
    let likeChange = 0;
    if (index === -1) {
      user.likes.push(newsId);
      likeChange = 1;

      // nambah notification
      if (news.userId && news.userId.toString() !== userId) {
        notificationPromise = await Notification.create({
          from: userId,
          to: news.userId,
          type: "like",
          newsId,
          message: `${user.userName} Likes your news`,
        });
      }
    } else {
      // hapus notification
      user.likes.splice(index, 1);
      likeChange = -1;
      notificationPromise = await Notification.findOneAndDelete({
        from: userId,
        to: news.userId,
        type: "like",
        newsId,
      });
    }
    console.log("cek index:", Date.now() - indexTime, "ms");

    await News.findByIdAndUpdate(newsId, { $inc: { likes: likeChange } });
    const saveTime = Date.now();
    await Promise.all([user.save(), notificationPromise]);
    console.log("save user:", Date.now() - saveTime, "ms");

    console.log(`Selesai likeUnlike...${Date.now() - startTime}ms`);
    res.status(200).json({ message: "likeUnlike toggled", likes: user.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const startTime = Date.now();
    const { text, parentId = null } = req.body;
    const userId = req.user._id;
    const { newsId } = req.params;
    console.log("Mulai addComment...", Date.now() - startTime, "ms");

    const validateTime = Date.now();
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
    console.log("cek user & news:", Date.now() - validateTime, "ms");

    const commentTime = Date.now();
    const comment = await Comment.create({
      newsId,
      userId,
      text,
      parentId,
    });
    console.log("buat comment:", Date.now() - commentTime, "ms");

    await News.findByIdAndUpdate(newsId, { $inc: { comments: 1 } });

    const notificationTime = Date.now();
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
    console.log("buat notifikasi:", Date.now() - notificationTime, "ms");

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

    const [user, news] = await Promise.all([
      User.findById(userId),
      News.findById(newsId),
    ]);

    console.log("user:", user);
    console.log("news:", news);
    // cek user dan news
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    const index = user.marked.indexOf(newsId);
    console.log("index:", index);
    let notificationPromise = Promise.resolve();
    if (index === -1) {
      user.marked.push(newsId);

      // nambah notification
      if (news.userId && news.userId !== userId) {
        notificationPromise = await Notification.create({
          from: userId,
          to: news.userId,
          type: "marked",
          newsId,
          message: `${user.userName} Marked your news`,
        });
        console.log("Notification:", Notification.create);
      }
    } else {
      // hapus notification
      user.marked.splice(index, 1);
      notificationPromise = await Notification.findOneAndDelete({
        from: userId,
        to: news.userId,
        type: "marked",
        newsId,
      });
    }

    await Promise.all([notificationPromise, user.save()]);

    res.status(200).json({ message: "marked active", marked: user.marked });
    console.log("marked:", user.marked);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
