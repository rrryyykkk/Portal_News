import PageHeaders from "../../components/PageHeaders";
import CardProfile from "../../components/profile/CardProfile";
import HeadersPublic from "../../components/public/HeadersPublic";

const PublicProfile = ({ user, viewer, news }) => {
  const viewers = viewer.id === user.id;
  const isMe = viewer.id === user.id;
  console.log("viewers:", viewers);
  console.log("isMe:", isMe);
  return (
    <div>
      <PageHeaders curPage="Public Profile" />
      <HeadersPublic user={user} viewer={viewer} />
      <CardProfile news={news} />
    </div>
  );
};

export default PublicProfile;
