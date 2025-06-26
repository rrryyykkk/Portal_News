import express from "express";
import { searchAll } from "../controllers/search.controllers.js";

const router = express.Router();

router.get("/", searchAll);

export default router;
