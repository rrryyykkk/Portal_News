import express from "express";
import {
  editProfile,
  followers,
  followUnFollow,
  getProfile,
} from "../controllers/user.controllers.js";
import {
  verifyAdmin,
  verifyCookieToken,
} from "../middlewares/auth.Middlewares.js";
import { uploadProfileImages } from "../utils/multer.js";

const router = express.Router();

router.get("/me", verifyCookieToken, getProfile);
router.put("/edit", verifyCookieToken, uploadProfileImages, editProfile);
router.post("/follow/:id", verifyCookieToken, followUnFollow);
router.get("/followers", verifyCookieToken, verifyAdmin, followers);

export default router;
