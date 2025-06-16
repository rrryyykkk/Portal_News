import axiosInstance from "./axios";

// edit profile
export const editProfile = (data) => axiosInstance.put("/user/edit", data);
