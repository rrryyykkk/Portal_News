import axiosInstance from "./axios";

// get All comment
export const getAllComments = ({ newsId }) =>
  axiosInstance.get(`/activities/${newsId}`);

// create comment
export const addComment = ({ newsId, text }) =>
  axiosInstance.post(`/activities/${newsId}/comments`, { text });

// edit comment
export const editComment = ({ commentId, text }) =>
  axiosInstance.post(`/activities/${commentId}/editComments`, { text });

// reply comment
export const replyComment = ({ newsId, parentId, text }) =>
  axiosInstance.post(`/activities/${newsId}/replyComments/${parentId}`, {
    text,
  });

// likes/unlike news
export const likeUnlike = ({ type, targetId }) =>
  axiosInstance.post(`/activities/likes/${type}/${targetId}`);

// marked news
export const markedNews = (newsId) =>
  axiosInstance.post(`/activities/${newsId}/marked`);

// statistik admin
export const getStatisticAdmin = (period = "month") =>
  axiosInstance
    .get(`/news/stat/admin`, { params: { period } })
    .then((res) => res.data);

// follow/unfollow user
export const followUnFollow = (id) => axiosInstance.post(`/user/follow/${id}`);
