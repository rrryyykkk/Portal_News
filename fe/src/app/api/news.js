import axiosInstance from "./axios";

// getNews
export const getNews = () => axiosInstance.get("/news");

// getNewsById + statistic by id
export const getNewsById = (id) => axiosInstance.get(`/news/${id}`);

// createNews
export const createNews = (formData) => {
  axiosInstance.post("/news/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

// deleteNews
export const deleteNews = (id) => axiosInstance.delete(`/news/delete/${id}`);

// updateNews
export const updateNews = (id, formData) => {
  axiosInstance.put(`/news/updated/${id}`, formData);
};

// related news
export const getRelatedNews = (id) => axiosInstance.get(`/news/${id}/related`);

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
