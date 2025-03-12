import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import newsRoutes from "./routes/news.routes.js";
import activitiesRoutes from "./routes/activities.routes.js";

const app = express();
dotenv.config();

// env
const PORT = process.env.PORT;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/activities", activitiesRoutes);

app.listen(PORT, () => {
  console.log(`server in running in localhost:${PORT}`);
  connectDB();
});
