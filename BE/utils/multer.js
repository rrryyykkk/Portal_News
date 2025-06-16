// middlewares/upload.middleware.js
import multer from "multer";
import path from "path";

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const videoMimeTypes = ["video/mp4", "video/quicktime", "video/webm"];
const validExtensions = {
  image: [".jpg", ".jpeg", ".png", ".webp", ".svg"],
  video: [".mp4", ".mov", ".mkv", ".webm"],
};

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isImage =
    imageMimeTypes.includes(mimetype) && validExtensions.image.includes(ext);
  const isVideo =
    videoMimeTypes.includes(mimetype) && validExtensions.video.includes(ext);

  if (!isImage && !isVideo) return cb(new Error("Invalid file type"));
  cb(null, true);
};

const storage = multer.memoryStorage(); // <- langsung dari buffer ke Cloudinary

export const uploadNewsMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // max 50MB
}).fields([
  { name: "newsImage", maxCount: 1 },
  { name: "newsVideo", maxCount: 1 },
]);

export const uploadProfileImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
}).fields([
  { name: "profileImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);
