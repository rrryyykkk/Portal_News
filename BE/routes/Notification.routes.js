import express from "express";
import { verifyCookieToken } from "../middlewares/auth.Middlewares.js";
import {
  deleteAllNotification,
  deleteOneNotification,
  getAllNotification,
} from "../controllers/Notification.controllers.js";

const router = express.Router();

router.get("/", verifyCookieToken, getAllNotification);
router.delete("/:notificationId", verifyCookieToken, deleteOneNotification);
router.delete("/", verifyCookieToken, deleteAllNotification);

export default router;
