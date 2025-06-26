import { useParams } from "react-router-dom";
import MeProfile from "./profile/MeProfile";
import PublicProfile from "./profile/PublicProfile";
import { useGetUsersById } from "../app/store/useUsers";
import Loading from "../components/common/Loading";
import Error from "../components/common/Error";

const ProfilePage = ({ isMe = false, meUser }) => {
  const { id } = useParams();

  // Deteksi apakah melihat profil sendiri
  const isViewingSelf = isMe || id === "me" || id === meUser?._id;

  // Query data user lain jika bukan profil sendiri
  const {
    data: publicUser,
    isLoading,
    isError,
  } = useGetUsersById(id, {
    enabled: !!id && !isViewingSelf,
  });

  // Sementara loading (profil sendiri)
  if (!meUser) return <Loading message="Loading your profile..." />;

  if (isViewingSelf) {
    return <MeProfile user={meUser} />;
  }

  if (isLoading) return <Loading message="Loading profile..." />;
  if (isError || !publicUser) return <Error message="Failed to load profile" />;

  return <PublicProfile user={publicUser} viewer={meUser} />;
};

export default ProfilePage;
