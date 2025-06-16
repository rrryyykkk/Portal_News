import rateLimit from "express-rate-limit";

export const LoginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 login requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after 1 minute",
});
