import Notification from "../models/notification.models.js";

export const getAllNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const startTime = Date.now();
    const notifications = await Notification.find({ to: userId })
      .select("_id from to message createdAt")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(page - 1) * parseInt(limit))
      .lean(); // gunakan lean() untuk mengambil data sebelum dikonversi menjadi JSON dan lebih cepat

    const endTime = Date.now();
    const executionTime = endTime - startTime;

    res.status(200).json({
      executionTime: `${executionTime} ms`,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOneNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    console.log("id:", notificationId);
    console.log("userId:", userId);

    const result = await Notification.findOneAndDelete({
      _id: notificationId,
      to: userId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await Notification.deleteMany({ to: userId });
    res.status(200).json({
      message: "Notification deleted successfully",
      deleteCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
