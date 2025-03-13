import express from "express";
import {
  addComment,
  editComment,
  getAllComments,
  likeUnlike,
  markedNews,
  replyComment,
} from "../controllers/activities.controllers.js";
import { verifyCookieToken } from "../middlewares/auth.Middlewares.js";

const router = express.Router();

router.get("/:newsId", getAllComments);
router.post("/:newsId/comments", verifyCookieToken, addComment);
router.post("/:commentId/editComments", verifyCookieToken, editComment);
router.post("/:newsId/replyComments/:parentId", verifyCookieToken, replyComment);
router.post("/:newsId/likes", verifyCookieToken, likeUnlike);
router.post("/:newsId/marked", verifyCookieToken, markedNews);

export default router;
