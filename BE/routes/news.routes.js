import express from "express";
import {
  addViews,
  verifyAdmin,
  verifyCookieToken,
} from "../middlewares/auth.Middlewares.js";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  getStatisticNewsById,
  getStatisticNewsGlobal,
  updateNews,
} from "../controllers/news.controllers.js";

const router = express.Router();

router.get("/", getAllNews);
router.post("/create", verifyCookieToken, verifyAdmin, createNews);
router.put("/updated/:id", verifyCookieToken, verifyAdmin, updateNews);
router.delete("/delete/:id", verifyCookieToken, verifyAdmin, deleteNews);
router.get(
  "/stat/global",
  verifyCookieToken,
  verifyAdmin,
  getStatisticNewsGlobal
);

router.post("/:newsId", addViews, getNewsById);
router.get("/:newsId", getStatisticNewsById);

export default router;
