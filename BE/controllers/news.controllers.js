import axios from "axios";
import News from "../models/news.models.js";
import crypto from "crypto";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

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

    let news;
    let totalNews = await News.countDocuments(filter);

    if (all === "true") {
      news = await News.find(filter).sort({ createdAt: -1 });
    } else {
      news = await News.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    }

    res.status(200).json({
      news,
      totalPages: all === "true" ? 1 : Math.ceil(totalNews / limit),
      currentPage: all === "true" ? 1 : page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fucntion generate id
function generateExternalId(item) {
  if (!item.url) return crypto.randomUUID(); // fallback
  return crypto.createHash("md5").update(item.url).digest("hex");
}

export const fecthAndSaveExternalNews = async (limit = 40, skip = 0) => {
  try {
    console.time("process External Data");
    console.time("fetch data mediastack");

    const response = await axios.get(`http://api.mediastack.com/v1/news`, {
      params: {
        access_key: process.env.NEWS_APIKEY,
        countries: "id",
        limit,
        offset: skip,
      },
    });

    console.timeEnd("fetch data mediastack");

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

    // 🧹 Hapus semua berita external sebelum menyimpan yang baru
    await News.deleteMany({ source: "external" });

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

    console.timeEnd("process External Data");
  } catch (error) {
    console.error("❌ Error fetching external news:", error.message);
    throw error;
  }
};

export const fecthDataNewsExternal = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;
    await fecthAndSaveExternalNews(limit, skip);

    const news = await News.find({ source: "external" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ success: true, news });
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

// news by id
export const getNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    news.views += 1;
    news.trendyScore += news.views * 0.7 + news.likes * 0.3;
    await news.save();

    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to get the news",
      error: error.message,
    });
  }
};

// admin only
export const createNews = async (req, res) => {
  try {
    const { title, description, author, category } = req.body;

    const startUpload = Date.now();
    const imageFile = req.files?.newsImage?.[0];
    const videoFile = req.files?.newsVideo?.[0];

    const newsImage = imageFile
      ? await uploadToCloudinary(imageFile.buffer, "news", imageFile.mimetype)
      : null;
    const newsVideo = videoFile
      ? await uploadToCloudinary(videoFile.buffer, "news", videoFile.mimetype)
      : null;
    console.log("upload time:", Date.now() - startUpload);

    const startSave = Date.now();
    const newNews = new News({
      title,
      description,
      author: req.user.userName || "admin",
      userId: req.user._id,
      newsImage,
      newsVideo,
      category,
      source: "admin",
      isTop: isTop || false,
      trendyScore: 0,
    });

    await newNews.save();
    console.log("save time:", Date.now() - startSave);
    res
      .status(200)
      .json({ message: "News successfuly created. ", news: newNews });
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to make news. ", error: error.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // validasi lebih awal
    let updateFields = {};

    // cek ad field yg diisi, dn masukan ke updateFields
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (category) updateFields.category = category;

    const imageFile = req.files?.newsImage?.[0];
    const videoFile = req.files?.newsVideo?.[0];

    if (imageFile) {
      updateFields.newsImage = await uploadToCloudinary(
        imageFile.buffer,
        "news",
        imageFile.mimeType
      );
    }
    if (videoFile) {
      updateFields.newsVideo = await uploadToCloudinary(
        videoFile.buffer,
        "news",
        videoFile.mimeType
      );
    }

    if (Object.keys(updateFields).length === 0)
      return res
        .status(400)
        .json({ message: "No fields to update", success: false });

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedNews) {
      return res
        .status(401)
        .json({ message: "News not found", success: false });
    }

    // auto calculate si trendyScore
    updatedNews.trendyScore = updatedNews.views * 0.7 + updatedNews.likes * 0.3;

    await updatedNews.save();

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      news: updatedNews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "failed to update news",
      error: error.message,
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
    res.status(500).json({
      success: false,
      message: "Failed to delete news.",
      error: error.message,
    });
  }
};

// statistic news by Id
export const getStatisticNewsById = async (req, res) => {
  try {
    const { newsId } = req.params;

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({
      title: news.title,
      views: news.views,
      likes: news.likes,
      comments: news.comments,
      createdAt: news.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// statistic news global
export const getStatisticNewsGlobal = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Acces denied. Admin only" });
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

    const newsStat = await News.find(
      {
        createdAt: { $gte: startDate },
      },
      { title: 1, views: 1, likes: 1, comments: 1, createdAt: 1 }
    ).sort({ views: -1, createdAt: -1 });

    res.status(200).json({ period, newsStat });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// top news
export const topNews = async (req, res) => {
  try {
    const news = await News.find({ isTop: true }).sort({ views: -1 }).limit(10);
    console.log("news:", news);
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// popular News
export const popularNews = async (req, res) => {
  try {
    const news = await News.find().sort({ views: -1 }).limit(10);
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// trending news
export const getTrendyNews = async (req, res) => {
  try {
    const news = await News.find().sort({ trendyScore: -1 }).limit(10);
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, news });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
