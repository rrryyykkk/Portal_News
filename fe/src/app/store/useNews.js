import { getStatisticAdmin } from "../api/activities";
import {
  createNews,
  deleteNews,
  getLatestNews,
  getNews,
  getNewsById,
  getRelatedNews,
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
    refetchInterval: 10000, // ⏱ auto refresh setiap 10 detik
    refetchOnWindowFocus: true, // 🔄 auto refresh saat tab dibuka kembali
    staleTime: 0, // dianggap selalu stale agar selalu ambil data baru
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
export const useStatistikAdmin = (period = "month") =>
  useQuery({
    queryKey: ["statistik-admin", period],
    queryFn: () => getStatisticAdmin(period),
    refetchInterval: 10000, // refetch setiap 10 detik
    refetchOnWindowFocus: true, // refetch ketika window di focus
    staleTime: 0, // dianggep selalu stale agar windows selalu refetc
  });

// create news
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// delete news
export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// update news
export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// related news
export const useRelatedNews = (id) => {
  return useQuery({
    queryKey: ["related-news", id],
    queryFn: () => getRelatedNews(id),
    enabled: !!id,
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
