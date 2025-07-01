import axios from "axios";
import News from "../models/news.models.js";
import crypto from "crypto";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { query, validationResult } from "express-validator";
import mongoose from "mongoose";
import User from "../models/user.models.js";
import viewLog from "../models/viewLog.js";

// mediastack + local news(admin)
export const getAllNews = async (req, res) => {
  try {
    let { page = 1, limit = 50, source, category, search, all } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};
    if (source) filter.source = source;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    // ambil id user jika login
    const userId = req.user?._id;
    let markedSet = new Set();

    if (userId) {
      const user = await User.findById(userId).select("marked").lean();
      if (user?.marked) {
        markedSet = new Set(user.marked.map((id) => id.toString()));
      }
    }

    let totalNews = await News.countDocuments(filter);

    let newsQuery = News.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "userName profileImage");

    // Apply pagination if 'all' is not true
    if (all !== "true") {
      newsQuery = newsQuery.skip((page - 1) * limit).limit(limit);
    }

    // execute query
    const news = await newsQuery.lean();

    // mapping to customize author name
    const mappedNews = news.map((item) => ({
      ...item,
      author:
        item.source === "admin"
          ? item.userId?.userName || "admin"
          : item.author,
      bookmark: markedSet.has(item._id.toString()),
    }));
    res.status(200).json({
      news: mappedNews,
      totalPages: all === "true" ? 1 : Math.ceil(totalNews / limit),
      currentPage: all === "true" ? 1 : page,
    });
  } catch (error) {
    console.log("Error fetching news:", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

// fucntion generate id
function generateExternalId(item) {
  if (!item.url) return crypto.randomUUID(); // fallback
  return crypto.createHash("md5").update(item.url).digest("hex");
}

// sanitasi validate externalNews
export const validateGetExternalNews = [
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be a number"),
  query("skip")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Skip must be a number"),
];

export const fecthAndSaveExternalNews = async (limit = 20, skip = 0) => {
  try {
    const response = await axios.get(`http://api.mediastack.com/v1/news`, {
      params: {
        access_key: process.env.NEWS_APIKEY,
        countries: "id",
        limit,
        offset: skip,
      },
    });

    const fetchedNews = response?.data?.data || [];

    const validNews = fetchedNews.filter(
      (item) => item.title && item.description && item.url && item.published_at
    );

    const externalIds = validNews.map((item) => generateExternalId(item));

    const existingDocs = await News.find(
      { externalId: { $in: externalIds } },
      { externalId: 1 }
    );

    const existingExternalIds = new Set(
      existingDocs.map((doc) => doc.externalId)
    );

    const newNews = validNews.filter((item) => {
      const generatedId = generateExternalId(item);
      return !existingExternalIds.has(generatedId);
    });

    // 💾 Simpan berita baru
    if (newNews.length > 0) {
      await News.insertMany(
        newNews.map((item) => ({
          title: item.title,
          description: item.description,
          author: item.author || "Unknown",
          category: item.category || "general",
          newsImage: item.image || null,
          source: "external",
          externalId: generateExternalId(item),
          likes: 0,
          comments: 0,
          views: 0,
          createdAt: new Date(item.published_at),
        }))
      );

      console.log(`✅ ${newNews.length} berita baru berhasil disimpan.`);
    } else {
      console.log("ℹ️ Tidak ada berita baru yang perlu disimpan.");
    }
  } catch (error) {
    console.error("❌ Error fetching external news:", error.message);
    throw error;
  }
};

export const fecthDataNewsExternal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = parseInt(req.query.skip) || 0;

    const [news, total] = await Promise.all([
      News.find({ source: "external" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      News.countDocuments({ source: "external" }),
    ]);

    res.status(200).json({
      success: true,
      news,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: skip / limit + 1,
    });
  } catch (error) {
    console.error("Error fetching external news:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteOldExternalNews = async () => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await News.deleteMany({
      source: "external",
      createdAt: { $lt: oneWeekAgo },
    });
    return result.deletedCount;
  } catch (error) {
    console.error("Error delete news:", error.message);
    return 0; // supaya deleteNewsExternalId tetap bisa response nilai
  }
};

export const deleteNewsExternalId = async (req, res) => {
  try {
    const deletedCount = await deleteOldExternalNews();
    res.status(200).json({
      message: "News deleted successfully.",
      success: true,
      deletedCount,
    });
  } catch (error) {
    console.error("Error delete news:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// admin only
export const createNews = async (req, res) => {
  try {
    const { title, description, author, category } = req.body;

    const imageFile = req.files?.newsImage?.[0];
    const videoFile = req.files?.newsVideo?.[0];

    const newsImage = imageFile
      ? await uploadToCloudinary(imageFile.buffer, "news", imageFile.mimetype)
      : null;
    const newsVideo = videoFile
      ? await uploadToCloudinary(videoFile.buffer, "news", videoFile.mimetype)
      : null;

    const newNews = new News({
      title,
      description,
      author: req.user.userName || "admin",
      userId: req.user._id,
      newsImage: newsImage?.secure_url || null,
      newsVideo: newsVideo?.secure_url || null,
      category,
      source: "admin",
      trendyScore: 0,
    });

    await newNews.save();
    res
      .status(200)
      .json({ message: "News successfuly created. ", news: newNews });
  } catch (error) {
    console.log("❌ failed to make news. ", error.message);
    res.status(500).json({ message: "failed to make news. " });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    let updateFields = {};
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;

    const mediaFile =
      req.files?.newsMedia?.[0] ||
      req.files?.newsVideo?.[0] ||
      req.files?.newsImage?.[0];

    if (mediaFile) {
      const result = await uploadToCloudinary(
        mediaFile.buffer,
        "news",
        mediaFile.mimetype
      );

      const url = result.secure_url;

      if (mediaFile.mimetype.startsWith("image")) {
        updateFields.newsImage = url;
        updateFields.newsVideo = null; // reset video
      } else if (mediaFile.mimetype.startsWith("video")) {
        updateFields.newsVideo = url;
        updateFields.newsImage = null; // reset image
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ message: "No fields to update", success: false });
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedNews) {
      return res
        .status(404)
        .json({ message: "News not found", success: false });
    }

    // Recalculate trendy score
    updatedNews.trendyScore = updatedNews.views * 0.7 + updatedNews.likes * 0.3;
    await updatedNews.save();

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      news: updatedNews,
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update news",
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews)
      return res
        .status(404)
        .json({ success: false, message: "News nont found" });

    res
      .status(200)
      .json({ success: true, message: "News deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete news.",
    });
  }
};

// statistic news by Id + get news by id
export const getStatisticNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;
    const userId = req.user?._id;
    const ip = req.header["x-forwarded-for"] || req.socket.remoteAddress;

    // validasi newsId dari mongo
    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(404).json({ message: "invalid newsId" });
    }

    const news = await News.findById(newsId).populate(
      "userId",
      "userName fullName profileImage"
    );

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // cek apakah user view berita ini apa blm dalam 12 jam terakhir
    const recentView = await viewLog.findOne({
      newsId,
      ...(userId ? { userId } : { ip }),
      viewedAt: { $gte: new Date(Date.now() - 12 * 60 * 60 * 1000) }, // 12 jam terakhir
    });

    // tambah views
    if (!recentView) {
      news.views += 1;
      await news.save();

      await viewLog.create({
        newsId,
        userId,
        ip,
      });
    }

    // cek apakah sduh follow user
    let isFollowing = false;
    if (userId && news.userId?._id) {
      const currnentUser = await User.findById(userId)
        .select("following")
        .lean();
      if (currnentUser?.following?.includes(news.userId._id.toString())) {
        isFollowing = true;
      }
    }

    const author = news.userId
      ? {
          _id: news.userId._id,
          userName: news.userId.userName,
          fullName: news.userId.fullName,
          profileImage: news.userId.profileImage,
          isFollowing,
        }
      : {
          userName: news.author || "Anonymous",
          fullName: news.author || "Anonymous",
          isFollowing: false,
        };

    // cek marked sudh ada atau belum
    let markedSet = new Set();
    if (userId) {
      const user = await User.findById(userId).select("marked").lean();
      if (user?.marked) {
        markedSet = new Set(user.marked.map((id) => id.toString()));
      }
    }

    res.status(200).json({
      title: news.title,
      description: news.description,
      author: author,
      image: news.newsImage,
      video: news.newsVideo,
      category: news.category,
      source: news.source,
      isTop: news.isTop,
      trendyScore: news.trendyScore,
      views: news.views,
      likes: news.likes,
      marked: markedSet.has(newsId.toString()),
      comments: news.comments,
      createdAt: news.createdAt,
    });
  } catch (error) {
    console.log("getStatisticNewsById error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 📊 Dapatkan statistik berita yang diposting oleh admin (user yang sedang login)
export const getStatisticNewsByAdmin = async (req, res) => {
  try {
    // ✅ Validasi autentikasi dan role
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId || role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { period } = req.query;
    let startDate = new Date();

    switch (period) {
      case "day":
        startDate.setUTCHours(0, 0, 0, 0);
        break;
      case "week":
        startDate.setUTCDate(startDate.getUTCDate() - 7);
        break;
      case "month":
        startDate.setUTCMonth(startDate.getUTCMonth() - 1);
        break;
      case "year":
        startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);
        break;
      default:
        return res.status(400).json({ message: "Invalid period" });
    }

    // ✅ Query hanya news yang dibuat oleh admin login (source === "admin" && userId match)
    const newsStat = await News.find(
      {
        userId: userId,
        source: "admin",
        createdAt: { $gte: startDate },
      },
      {
        title: 1,
        views: 1,
        likes: 1,
        comments: 1,
        createdAt: 1,
      }
    ).sort({ views: -1, createdAt: -1 });

    // ✅ Return statistik secara aman
    res.status(200).json({ period, count: newsStat.length, newsStat });
  } catch (error) {
    console.error("Statistik Admin Error:", error.message);
    res
      .status(500)
      .json({ message: "Gagal mendapatkan statistik", error: error.message });
  }
};

// related news
export const getRelatedNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(404).json({ message: "Invalid newsId" });
    }

    const currentNews = await News.findById(newsId).lean();
    if (!currentNews) {
      return res.status(404).json({ message: "News not found" });
    }

    const excludeIds = [newsId];

    let relatedNews = [];

    // 1. Berdasarkan kategori
    const byCategory = await News.find({
      _id: { $nin: excludeIds },
      category: currentNews.category,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .populate("userId", "userName fullName profileImage")
      .lean();

    relatedNews.push(...byCategory);
    excludeIds.push(...byCategory.map((n) => n._id.toString()));

    // 2. Berdasarkan source
    if (relatedNews.length < 8) {
      const bySource = await News.find({
        _id: { $nin: excludeIds },
        source: currentNews.source,
      })
        .sort({ createdAt: -1 })
        .limit(8 - relatedNews.length)
        .lean();

      relatedNews.push(...bySource);
      excludeIds.push(...bySource.map((n) => n._id.toString()));
    }

    // 3. Berdasarkan author
    if (relatedNews.length < 8 && currentNews.userId) {
      const byAuthor = await News.find({
        _id: { $nin: excludeIds },
        userId: currentNews.userId,
      })
        .sort({ createdAt: -1 })
        .limit(8 - relatedNews.length)
        .lean();

      relatedNews.push(...byAuthor);
      excludeIds.push(...byAuthor.map((n) => n._id.toString()));
    }

    // 4. Bookmark user login
    let markedSet = new Set();
    if (userId) {
      const user = await User.findById(userId).select("marked").lean();
      if (user?.marked) {
        markedSet = new Set(user.marked.map((id) => id.toString()));
      }
    }

    // 5. Tambahkan field bookmark dan author (jika internal)
    const withExtras = await Promise.all(
      relatedNews.map(async (item) => {
        let author = null;
        if (item.userId) {
          author = await User.findById(item.userId)
            .select("fullName userName profileImage")
            .lean();
        }

        return {
          ...item,
          bookmark: markedSet.has(item._id.toString()),
          author,
        };
      })
    );

    return res.status(200).json({
      success: true,
      relatedNews: withExtras,
    });
  } catch (error) {
    console.error("getRelatedNews error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// top news
export const topNews = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let news = await News.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $addFields: {
          trendyScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$views", 0] }, 0.5] },
              { $multiply: [{ $ifNull: ["$likes", 0] }, 0.3] },
              { $multiply: [{ $ifNull: ["$comments", 0] }, 0.2] },
            ],
          },
        },
      },
      { $sort: { trendyScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          newsImage: 1,
          newsVideo: 1,
          category: 1,
          trendyScore: 1,
          createdAt: 1,
          user: {
            _id: 1,
            userName: 1,
            fullName: 1,
            profileImage: 1,
          },
        },
      },
    ]);

    if (!news || news.length === 0) {
      news = await News.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("userId", "fullName userName profileImage")
        .lean(); // langsung lean agar bersih
    }

    let markedSet = new Set();
    if (userId) {
      const user = await User.findById(userId).select("marked").lean();
      if (user?.marked) {
        markedSet = new Set(user.marked.map((id) => id.toString()));
      }
    }

    // Bersihkan hasil agar tidak ada _doc dengan map bersih
    const newsWithBookmark = news.map((item) => {
      const cleanItem = item.toObject ? item.toObject() : item;
      return {
        ...cleanItem,
        bookmark: markedSet.has(item._id.toString()),
      };
    });

    res.status(200).json({ success: true, news: newsWithBookmark });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// popular news

// algo buat si popular news
export const calculatePopularityScore = ({
  views = 0,
  likes = 0,
  comments = 0,
  createdAt,
}) => {
  const now = new Date();
  const hoursSince = Math.max(
    (now - new Date(createdAt)) / (1000 * 60 * 60),
    1
  ); // avoid 0

  const viewWeight = 0.5;
  const likeWeight = 0.3;
  const commentWeight = 0.2;
  const agePenalty = Math.pow(hoursSince + 2, 1.2); // smooth curve

  const rawScore =
    views * viewWeight + likes * likeWeight + comments * commentWeight;
  const score = rawScore / agePenalty;

  return score;
};

export const popularNews = async (req, res) => {
  try {
    const userId = req.user?._id; // ⬅️ pastikan verifyCookieToken atau optionalAuth dipakai

    const newsList = await News.find({})
      .populate("userId", "userName fullName profileImage")
      .lean();

    let markedSet = new Set();
    if (userId) {
      const user = await User.findById(userId).select("marked").lean();
      if (user?.marked) {
        markedSet = new Set(user.marked.map((id) => id.toString()));
      }
    }

    // hitung popularity score
    const scoredNews = newsList.map((item) => {
      const score = calculatePopularityScore({
        views: item.views || 0,
        likes: item.likes?.length || 0,
        comments: item.comments || 0,
        createdAt: item.createdAt,
      });

      return {
        ...item,
        popularScore: score,
        bookmark: markedSet.has(item._id.toString()),
      };
    });

    // sort berdasrkan score
    const sortedNews = scoredNews.sort(
      (a, b) => b.popularScore - a.popularScore
    );

    res.status(200).json({ success: true, news: sortedNews.slice(0, 10) });
  } catch (error) {
    console.log("popular news error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// trending news
export const getTrendyNews = async (req, res) => {
  try {
    // hitung 1 hari
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    // hitung 3 hari
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);

    const userId = req.user?._id;

    const buildPipeline = (date) => [
      { $match: { createdAt: { $gte: date } } },
      {
        $addFields: {
          trendyScore: {
            $add: [
              { $multiply: [{ $ifNull: ["$views", 0] }, 0.3] },
              { $multiply: [{ $ifNull: ["$likes", 0] }, 0.4] },
              { $multiply: [{ $ifNull: ["$comments", 0] }, 0.3] },
            ],
          },
        },
      },
      { $sort: { trendyScore: -1 } },
      { $limit: 10 },
      // populate userId
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      // batasi field yg dikembalikan
      {
        $project: {
          title: 1,
          description: 1,
          newsImage: 1,
          newsVideo: 1,
          category: 1,
          trendyScore: 1,
          createdAt: 1,
          author: 1,
          user: {
            _id: 1,
            userName: 1,
            fullName: 1,
            profileImage: 1,
          },
        },
      },
    ];

    // urutan fallback
    // Try 1 day
    let news = await News.aggregate(buildPipeline(oneDayAgo));
    // 3 days
    if (!news.length) {
      news = await News.aggregate(buildPipeline(threeDaysAgo));
    }
    // Fallback all time (no filter)
    if (!news.length) {
      news = await News.aggregate(buildPipeline(new Date("2020-01-01")));
    }

    // tambahkan bookmark info jika user sudah login
    let markedSet = new Set();
    if (userId) {
      const user = await User.findById(userId).select("marked").lean();
      if (user?.marked) {
        markedSet = new Set(user.marked.map((id) => id.toString()));
      }
    }

    const newsWithBookmark = news.map(
      (item) => (
        console.log("item:", item),
        {
          ...item,
          bookmark: markedSet.has(item._id.toString()),
        }
      )
    );

    res.status(200).json({ success: true, news: newsWithBookmark });
  } catch (error) {
    console.log("trendy:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getLatestNews = async (req, res) => {
  try {
    const news = await News.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "fullName userName profileImage");
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
