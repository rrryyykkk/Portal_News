import { useState } from "react";
import PageHeaders from "../../components/PageHeaders";
import HeaderMe from "../../components/me/HeaderMe";
import SendPost from "../../components/me/SendPost";
import Posts from "../../components/me/Posts";
import Marked from "../../components/me/Marked";

const MeProfile = ({ user, news }) => {
  console.log("user-me:", user);
  const [activeTab, setActiveTab] = useState("marked"); // default tab untuk user biasa

  const renderTabPage = () => {
    switch (activeTab) {
      case "marked":
        return <Marked user={user} />;
      case "send":
        return <SendPost />;
      case "post":
        return <Posts news={news} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <PageHeaders curPage="My Profile" />
      <HeaderMe user={user} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="px-4 md:px-8 my-5">
        {user.role === "admin" ? renderTabPage() : <Marked user={user} />}
      </div>
    </div>
  );
};

export default MeProfile;
