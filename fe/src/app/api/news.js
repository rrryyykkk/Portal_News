import axiosInstance from "./axios";

// getNews
export const getNews = () => axiosInstance.get("/news");

// getNewsById + statistic by id
export const getNewsById = (id) => axiosInstance.get(`/news/${id}`);

// createNews
export const createNews = (data) => axiosInstance.post("/news/create", data);

// deleteNews
export const deleteNews = (id) => axiosInstance.delete(`/news/delete/${id}`);

// updateNews
export const updateNews = (id, data) =>
  axiosInstance.put(`/news/updated/${id}`, data);

// topNews
export const topNews = () => axiosInstance.get("/news/top");

// popularNews
export const popularNews = () => axiosInstance.get("/news/popular");

// getTrendyNews
export const getTrendyNews = () => axiosInstance.get("/news/trendy");

// getLatestNews
export const getLatestNews = () => axiosInstance.get("/news/latest");

// getStatisticNewsAll
export const getStatisticNewsAll = () => axiosInstance.get("/news/stat/global");
