import { useParams } from "react-router-dom";
import MeProfile from "./profile/MeProfile";
import PublicProfile from "./profile/PublicProfile";

const ProfilePage = ({ isMe = false, meUser, news }) => {
  const { id } = useParams();

  if (isMe || id === "me" || id === meUser?.id) {
    return <MeProfile user={meUser} news={news} />;
  }

  const user = id ? news.find((user) => user.id === id) : null;

  return <PublicProfile user={user} viewer={meUser} news={news} />;
};

export default ProfilePage;
