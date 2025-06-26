import axiosInstance from "./axios";

// edit profile
export const editProfile = (data) => axiosInstance.put("/user/edit", data);

// get profile by id
export const getProfileById = async (id) => {
  const res = await axiosInstance.get(`/user/${id}`);
  return res.data;
};
