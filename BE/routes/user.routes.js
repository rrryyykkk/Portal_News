import express from "express";
import {
  editProfile,
  followers,
  followUnFollow,
  getProfile,
  getProfileById,
} from "../controllers/user.controllers.js";
import {
  verifyAdmin,
  verifyCookieToken,
} from "../middlewares/auth.Middlewares.js";
import { uploadProfileImages } from "../utils/multer.js";
import { rateLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.get("/me", verifyCookieToken, getProfile);
router.put("/edit", verifyCookieToken, uploadProfileImages, editProfile);
router.get("/:id", verifyCookieToken, rateLimiter, getProfileById);
router.post("/follow/:id", verifyCookieToken, followUnFollow);
router.get("/followers", verifyCookieToken, verifyAdmin, followers);

export default router;
