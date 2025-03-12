import axios from "axios";
import News from "../models/news.models.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// mediastack + local news(admin)
export const getAllNews = async (req, res) => {
  try {
    // ambil query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseFloat(req.query.limit) || 5;
    const skip = (page - 1) * limit; // hitung data yang akan dilewati

    // data dari admin
    const totalAdminNews = await News.countDocuments();
    const adminNews = await News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // data dari mediastack
    const externalNewsResponse = await axios.get(
      `http://api.mediastack.com/v1/news`,
      {
        params: {
          access_key: process.env.NEWS_APIKEY,
          countries: "id",
          limit: limit,
          skip: skip,
        },
      }
    );

    const externalNews = externalNewsResponse.data.data.map((item) => ({
      title: item.title,
      description: item.description,
      author: item.author || "Unknoun",
      category: item.category || "Other",
      newsImage: item.image,
      source: "external",
      exteranalId: item.id,
    }));

    // gabungan data dari mediastack dan admin
    const combinedNews = [...externalNews, ...adminNews];

    res.status(200).json({
      success: true,
      currentPage: page,
      totalAdminNews,
      totalExternalNews: externalNewsResponse.data.pagination.total || 0,
      totalNews:
        totalAdminNews + (externalNewsResponse.data.pagination.total || 0),
      news: combinedNews,
    });
  } catch (error) {
    console.error("Error ambil data:", error.message);
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
    let updateFields = { title, description, category };

    if (req.files?.newsImage) {
      updateFields.newsImage = await uploadToCloudinary(
        req.files.newsImage[0].buffer,
        "news",
        req.files.newsImage[0].mimeType
      );
    }
    if (req.files?.newsImage) {
      updateFields.newsImage = await uploadToCloudinary(
        req.files.newsImage[0].buffer,
        "news",
        req.files.newsImage[0].mimeType
      );
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updateNews) {
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
