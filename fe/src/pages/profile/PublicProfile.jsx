/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useToggleMarked } from "../../app/store/useActivities";
import { useToastStore } from "../../app/store/useToastStore";
import PageHeaders from "../../components/PageHeaders";
import CardProfile from "../../components/profile/CardProfile";
import HeadersPublic from "../../components/public/HeadersPublic";

const PublicProfile = ({ user, viewer }) => {
  const marked = user.marked;
  const toggleMarked = useToggleMarked();
  const setToast = useToastStore((state) => state.setToast);
  const [postsData, setPostsData] = useState([]);

  useEffect(() => {
    setPostsData(marked);
  }, [marked]);

  const handleBookmark = (newsId, isBookmarked) => {
    if (!newsId) {
      return setToast({ type: "error", message: "News not found" });
    }

    toggleMarked.mutate(newsId, {
      onSuccess: () => {
        setPostsData((prevNews) =>
          prevNews.map(
            (n) => (n._id === newsId ? { ...n, bookmark: !isBookmarked } : n) // ✅ ini kuncinya
          )
        );

        setToast({
          type: isBookmarked ? "info" : "success",
          message: isBookmarked
            ? "Unbookmark successfully"
            : "Bookmark successfully",
        });
      },
      onError: (error) => {
        setToast({
          type: "error",
          message: "Bookmark failed. Please login.",
        });
      },
    });
  };

  return (
    <div>
      <PageHeaders curPage="Public Profile" />
      <HeadersPublic user={user} viewer={viewer} />
      <CardProfile
        marked={postsData}
        toggleMarked={handleBookmark}
        isBookmarked={postsData.some((n) => n.bookmark)}
      />
    </div>
  );
};

export default PublicProfile;
