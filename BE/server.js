import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import newsRoutes from "./routes/news.routes.js";
import searchRoutes from "./routes/search.routes.js";
import activitiesRoutes from "./routes/activities.routes.js";
import notificationRoutes from "./routes/Notification.routes.js";
import "./middlewares/sanitaze.js";
import "./jobs/cron.schedule.js";
import cors from "cors";

dotenv.config();

const app = express();

// env
const PORT = process.env.PORT;

// cors
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// middleware
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`server in running in localhost:${PORT}`);
  connectDB();
});
