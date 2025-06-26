import PageHeaders from "../../components/PageHeaders";
import CardProfile from "../../components/profile/CardProfile";
import HeadersPublic from "../../components/public/HeadersPublic";

const PublicProfile = ({ user, viewer }) => {
  const marked = user.marked;
  console.log("marked:", marked);
  return (
    <div>
      <PageHeaders curPage="Public Profile" />
      <HeadersPublic user={user} viewer={viewer} />
      <CardProfile marked={marked} />
    </div>
  );
};

export default PublicProfile;
