import PageHeaders from "../components/PageHeaders";
import MainContent from "./singlePage/MainContent";
import Comments from "./singlePage/Comments";
import RelatedPost from "./singlePage/RelatedPost";
import { useNewsById } from "../app/store/useNews";
import { useParams } from "react-router-dom";
import Loading from "../components/common/Loading";
import Error from "../components/common/Error";
import { useToggleMarked } from "../app/store/useActivities";
import { useToastStore } from "../app/store/useToastStore";
import { useEffect, useState } from "react";

const SinglePage = () => {
  const { id } = useParams();
  const { data: news, isLoading, isError } = useNewsById(id);
  const toggleBookmark = useToggleMarked();
  const setToast = useToastStore((state) => state.setToast);
  console.log("id", id);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (news?.data.marked !== undefined) {
      setIsBookmarked(news?.data.marked);
    }
  }, [news]);

  if (isLoading) return <Loading message="Loading news..." />;
  if (isError) return <Error message="Failed to load news" />;

  return (
    <div>
      <PageHeaders curPage="Single Page" title="Test-1" />
      <MainContent
        news={news}
        toggleBookmark={toggleBookmark}
        setToast={setToast}
        newsId={id}
        isBookmarked={isBookmarked}
        setIsBookmarked={setIsBookmarked}
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
