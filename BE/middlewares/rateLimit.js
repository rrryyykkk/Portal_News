import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 15, // limit each IP to 15 login requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 1 minute",
});
