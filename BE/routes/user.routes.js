import express from "express";
import {
  editProfile,
  followers,
  followUnFollow,
  getProfile,
} from "../controllers/user.controllers.js";
import { verifyCookieToken } from "../middlewares/auth.Middlewares.js";

const router = express.Router();

router.get("/me", verifyCookieToken, getProfile);
router.put("/edit", verifyCookieToken, editProfile);
router.post("/follow/:id", verifyCookieToken, followUnFollow);
router.get("/followers/:targetUserId", verifyCookieToken, followers);

export default router;
