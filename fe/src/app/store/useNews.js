import {
  createNews,
  deleteNews,
  getLatestNews,
  getNews,
  getNewsById,
  getStatisticNewsAll,
  getTrendyNews,
  popularNews,
  topNews,
  updateNews,
} from "../api/news";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// get All
export const useNews = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: getNews,
  });
};

// get by id
export const useNewsById = (id) => {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
  });
};

// global statistiks
export const useStatisticNews = () => {
  return useQuery({
    queryKey: ["statistic-news"],
    queryFn: getStatisticNewsAll,
  });
};

// create news
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutation: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// delete news
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutation: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// update news
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutation: ({ id, data }) => updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// top News
export const useTopNews = () => {
  return useQuery({
    queryKey: ["top-news"],
    queryFn: topNews,
  });
};

// popular News
export const usePopularNews = () => {
  return useQuery({
    queryKey: ["popular-news"],
    queryFn: popularNews,
  });
};

// latest News
export const useLatestNews = () => {
  return useQuery({
    queryKey: ["latest-news"],
    queryFn: getLatestNews,
  });
};

// trendy news
export const useTrendyNews = () => {
  return useQuery({
    queryKey: ["trendy-news"],
    queryFn: getTrendyNews,
  });
};
