import express from "express";
import {
  optionalAuth,
  verifyAdmin,
  verifyCookieToken,
} from "../middlewares/auth.Middlewares.js";
import {
  createNews,
  deleteNews,
  deleteNewsExternalId,
  fecthDataNewsExternal,
  getAllNews,
  getLatestNews,
  getRelatedNews,
  getStatisticNewsByAdmin,
  getStatisticNewsById,
  getTrendyNews,
  popularNews,
  topNews,
  updateNews,
} from "../controllers/news.controllers.js";
import { uploadNewsMedia } from "../utils/multer.js";

const router = express.Router();

router.get("/", optionalAuth, getAllNews);
router.get(
  "/external/fecth",
  verifyCookieToken,
  verifyAdmin,
  fecthDataNewsExternal
);
router.post(
  "/create",
  verifyCookieToken,
  verifyAdmin,
  uploadNewsMedia,
  createNews
);
router.put(
  "/updated/:id",
  verifyCookieToken,
  verifyAdmin,
  uploadNewsMedia,
  updateNews
);
router.delete(
  "/external/clean",
  verifyCookieToken,
  verifyAdmin,
  deleteNewsExternalId
);
router.delete("/delete/:id", verifyCookieToken, verifyAdmin, deleteNews);
router.get(
  "/stat/admin",
  verifyCookieToken,
  verifyAdmin,
  getStatisticNewsByAdmin
);
router.get("/top", optionalAuth, topNews);
router.get("/popular", optionalAuth, popularNews);
router.get("/trendy", optionalAuth, getTrendyNews);
router.get("/latest", optionalAuth, getLatestNews);
router.get("/:newsId", optionalAuth, getStatisticNewsById);
router.get("/:newsId/related", optionalAuth, getRelatedNews);

export default router;
