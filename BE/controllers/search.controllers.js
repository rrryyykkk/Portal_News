import newsModels from "../models/news.models.js";
import User from "../models/user.models.js";

export const searchAll = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) {
      return res
        .status(400)
        .json({ message: "Minimal 2 huruf untuk pencarian." });
    }

    // Split kata kunci dan buat kondisi regex AND
    const keywords = q.split(" ").filter(Boolean);
    const regexConditions = keywords.map((word) => ({
      title: { $regex: word, $options: "i" },
    }));

    const news = await newsModels
      .find({ $and: regexConditions })
      .limit(5)
      .select("title newsImage category createdAt")
      .populate("userId", "userName profileImage")
      .lean();

    const users = await User.find({
      $or: [
        { userName: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
      ],
    })
      .select("_id userName fullName profileImage role")
      .limit(3)
      .lean();

    return res.json({ news, users });
  } catch (error) {
    console.error("❌ Regex Search Error:", error.message);
    return res.status(500).json({ message: "Gagal melakukan pencarian" });
  }
};
