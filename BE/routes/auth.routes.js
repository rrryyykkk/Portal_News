import express from "express";
import {
  registerWithEmail,
  loginWithEmail,
  logOut,
  socialLogin,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/register", registerWithEmail);
router.post("/login", loginWithEmail);
router.post("/socialLogin", socialLogin);
router.post("/logout", logOut);

export default router;
