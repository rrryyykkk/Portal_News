import express from "express";
import {
  registerWithEmail,
  loginWithEmail,
  logOut,
  socialLogin,
} from "../controllers/auth.controllers.js";
import { rateLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

router.post("/register",rateLimiter, registerWithEmail);
router.post("/login", rateLimiter, loginWithEmail);
router.post("/socialLogin", socialLogin);
router.post("/logout", logOut);

export default router;
