import React from "react";
import PageHeaders from "../components/PageHeaders";
import MainContent from "./singlePage/MainContent";
import SideBar from "../components/common/SideBar";
import Comments from "./singlePage/Comments";
import RelatedPost from "./singlePage/RelatedPost";

const SinglePage = () => {
  return (
    <div>
      <PageHeaders curPage="Single Page" title="Test-1" />
      <MainContent />
      <Comments />
      <RelatedPost />
    </div>
  );
};

export default SinglePage;
