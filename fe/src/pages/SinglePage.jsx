import PageHeaders from "../components/PageHeaders";
import MainContent from "./singlePage/MainContent";
import Comments from "./singlePage/Comments";
import RelatedPost from "./singlePage/RelatedPost";
import { useNewsById } from "../app/store/useNews";
import { useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import Error from "../components/common/Error";
import { useFollowUnfollow, useToggleMarked } from "../app/store/useActivities";
import { useToastStore } from "../app/store/useToastStore";
import { useEffect, useState } from "react";

const SinglePage = () => {
  const { id } = useParams();
  const { data: news, isLoading, isError } = useNewsById(id);

  const toggleBookmark = useToggleMarked();
  const setToast = useToastStore((state) => state.setToast);

  const userId = news?.data?.author?._id;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const { mutate: followUnFollow, isPending } = useFollowUnfollow();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    if (!userId) {
      setToast({ type: "error", message: "User not found" });
      return;
    }

    followUnFollow(userId, {
      onSuccess: () => {
        setIsFollowing((prev) => !prev);
        setToast({
          type: "success",
          message: isFollowing
            ? "Unfollowed successfully"
            : "Followed successfully",
        });
      },
      onError: () => {
        setToast({ type: "error", message: "Failed to update follow status" });
      },
    });
  };

  useEffect(() => {
    if (news?.data.marked !== undefined) {
      setIsBookmarked(news.data.marked);
    }
    if (news?.data.author?.isFollowing !== undefined) {
      setIsFollowing(news.data.author.isFollowing);
    }
  }, [news]);

  if (isLoading) return <Loading message="Loading news..." />;
  if (isError) return <Error message="Failed to load news" />;

  return (
    <div>
      <PageHeaders
        curPage="Single Page"
        title={news?.data?.title || "Loading..."}
      />
      <MainContent
        news={news}
        toggleBookmark={toggleBookmark}
        setToast={setToast}
        newsId={id}
        isBookmarked={isBookmarked}
        setIsBookmarked={setIsBookmarked}
        handleFollow={handleFollow}
        isPending={isPending}
        isFollowing={isFollowing}
      />
      <Comments newsId={id} setToast={setToast} />
      <RelatedPost
        newsId={id}
        toggleBookmark={toggleBookmark}
        setToast={setToast}
      />
    </div>
  );
};

export default SinglePage;
