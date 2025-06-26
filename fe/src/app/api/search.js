import axiosInstance from "./axios";

// search news + user
export const search = async (keyword) => {
  const res = await axiosInstance.get(
    `/search?q=${encodeURIComponent(keyword)}`
  );
  return res.data;
};
