import express from "express";
import {
  verifyAdmin,
  verifyCookieToken,
} from "../middlewares/auth.Middlewares.js";
import {
  createNews,
  deleteNews,
  getAllNews,
  updateNews,
} from "../controllers/news.controllers.js";

const router = express.Router();

router.get("/getAll", getAllNews);
router.post("/create", verifyCookieToken, verifyAdmin, createNews);
router.put("/updated/:id", verifyCookieToken, verifyAdmin, updateNews);
router.delete("/delete/:id", verifyCookieToken, verifyAdmin, deleteNews);

export default router;
