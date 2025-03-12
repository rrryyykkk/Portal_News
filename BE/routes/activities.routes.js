import express from "express";
import {
  addComment,
  getAllComments,
  likeUnlike,
} from "../controllers/activities.controllers.js";
import { verifyCookieToken } from "../middlewares/auth.Middlewares.js";

const router = express.Router();

router.get("/:newsId", getAllComments);
router.post("/:newsId/comments", verifyCookieToken, addComment);
router.post("/:newsId/likes", verifyCookieToken, likeUnlike);

export default router;
