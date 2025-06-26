import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addComment,
  editComment,
  followUnFollow,
  getAllComments,
  likeUnlike,
  markedNews,
  replyComment,
} from "../api/activities";

// get All comment
export const useAllComments = ({ newsId }) => {
  return useQuery({
    queryKey: ["all-comments", newsId],
    queryFn: () => getAllComments({ newsId }),
    enabled: !!newsId,
  });
};

//  add comment
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addComment,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["all-comments", variables.newsId],
      });
    },
  });
};

// edit comment
export const useEditComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, data }) => editComment({ commentId, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["all-comments", variables.newsId],
      });
    },
  });
};

// reply comment
export const useReplyComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ newsId, parentId, text }) =>
      replyComment({ newsId, parentId, text }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["all-comments", variables.newsId],
      });
    },
  });
};

// likes/unlikes
export const useLikeUnlike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likeUnlike,
    onSuccess: (response, variables) => {
      const { type, targetId, newsId } = variables;

      // Update cache agar jumlah likes langsung berubah
      if (type === "comment") {
        queryClient.setQueryData(["all-comments", newsId], (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              comments: oldData.data.comments.map((comment) =>
                comment._id === targetId
                  ? { ...comment, likes: response.data.likes }
                  : comment
              ),
            },
          };
        });
      }

      // Kalau type === "news", bisa tambahkan di sini juga (optional)

      // fallback invalidasi
      queryClient.invalidateQueries({
        queryKey:
          type === "news" ? ["news-by-id", targetId] : ["all-comments", newsId],
      });
    },
  });
};

// get marked and toogle
export const useToggleMarked = (userId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markedNews,
    onSuccess: (_, variables) => {
      console.log("markedNews", variables);
      // invalidate semua query yg mungkn mengandung berita  yg ad di-bookmark
      queryClient.invalidateQueries({ queryKey: ["marked"] });
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["popular-news"] });
      queryClient.invalidateQueries({ queryKey: ["top-news"] });
      queryClient.invalidateQueries({ queryKey: ["related-news"] });
      queryClient.invalidateQueries({ queryKey: ["latest-news"] });
      queryClient.invalidateQueries({ queryKey: ["trendy-news"] });

      // invalidate query spesifik comment(optional)
      queryClient.invalidateQueries({
        queryKey: ["user-profile", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-comments", variables.newsId],
      });
    },
  });
};

// follow/unfollow
export const useFollowUnfollow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => followUnFollow(id),
    onSuccess: () => {
      // refesh data pengguna setelah follow/unfollow
      queryClient.invalidateQueries({ queryKey: ["public-profile"] });
    },
  });
};
