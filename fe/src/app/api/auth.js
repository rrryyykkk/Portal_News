import axiosInstance from "./axios";

// login
export const loginToBackend = ({ idToken }) =>
  axiosInstance.post("/auth/login", { idToken });
// register
export const registerToBackend = (newUser) =>
  axiosInstance.post("/auth/register", newUser);
// get me
export const getMe = () => axiosInstance.get("/user/me");
// logout
export const logOut = () => axiosInstance.post("/auth/logout");
// social login
export const socialLogin = (idToken) =>
  axiosInstance.post("/auth/socialLogin", { idToken });
