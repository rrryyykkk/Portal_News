import axios from "axios";
import News from "../models/news.models.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// mediastack + local news(admin)
export const getAllNews = async (req, res) => {
  try {
    let { page = 1, limit = 10, source, category, search } = req.query;

    // konversi ke tipe data yang sesuai
    page = parseInt(page);
    limit = parseInt(limit);

    const filter = {};

    // filter berdasarkan source
    if (source) filter.source = source;
    // filter berdasarkan kategory
    if (category) filter.category = category;
    // filter berdasarkan search title
    if (search) filter.title = { $regex: search, $options: "i" };

    // hitung total data berdasarkan filter
    const totalNews = await News.countDocuments(filter);

    const news = await News.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      news,
      totalPages: Math.ceil(totalNews / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fecthDataNewsExternal = async (req, res) => {
  try {
    console.time("fetch data mediastack");

    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const response = await axios.get(`http://api.mediastack.com/v1/news`, {
      params: {
        access_key: process.env.NEWS_APIKEY,
        countries: "id",
        limit,
        offset: skip, // offset = skip
      },
    });
    console.log("response:", response.data);
    console.timeEnd("fetch data mediastack");

    const fetchedNews = response?.data?.data || [];
    const totalExternalNews = response?.data?.pagination?.total || 0;

    console.time("process External Data");

    // Ambil semua externalId yang ada di database untuk menghindari duplikasi
    const existingExternalIds = new Set(
      await News.find(
        { externalId: { $in: fetchedNews.map((n) => n.id) } },
        { externalId: 1 }
      ).then((docs) => docs.map((d) => d.externalId))
    );

    // Filter berita baru yang belum ada di database
    const newNews = fetchedNews.filter(
      (item) => !existingExternalIds.has(item.id)
    );

    // Simpan berita baru ke database
    if (newNews.length > 0) {
      await News.insertMany(
        newNews.map((item) => ({
          title: item.title,
          description: item.description,
          author: item.author || "Unknown",
          category: item.category || "Other",
          newsImage: item.image,
          source: "external",
          externalId: item.id,
          likes: 0,
          comments: 0,
          views: 0,
          createdAt: new Date(item.published_at),
        }))
      );
    }

    // Ambil ulang data external dari database setelah penyimpanan
    const externalNews = await News.find({ source: "external" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      totalExternalNews,
      news: externalNews,
    });
    console.timeEnd("process External Data");
  } catch (error) {
    console.error("Error fetching external news:", error.message);
  }
};

export const deleteNewsExternalId = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await News.deleteMany({
      source: "external",
      createdAt: { $lt: oneWeekAgo },
    });
    res.status(200).json({
      message: "News deleted successfully",
      deleteCount: result.deletedCount,
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
    let newsImage = null;
    let newsVideo = null;

    if (req.files?.newsImage) {
      newsImage = await uploadToCloudinary(
        req.files.newsImage[0].buffer,
        "news",
        req.files.newsImage[0].mimeType
      );
    }
    if (req.files?.newsVideo) {
      newsVideo = await uploadToCloudinary(
        req.files.newsVideo[0].buffer,
        "news",
        req.files.newsVideo[0].mimeType
      );
    }
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

    if (req.files?.newsImage) {
      updateFields.newsImage = await uploadToCloudinary(
        req.files.newsImage[0].buffer,
        "news",
        req.files.newsImage[0].mimeType
      );
    }
    if (req.files?.newsVideo) {
      updateFields.newsVideo = await uploadToCloudinary(
        req.files.newsVideo[0].buffer,
        "news",
        req.files.newsVideo[0].mimeType
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
