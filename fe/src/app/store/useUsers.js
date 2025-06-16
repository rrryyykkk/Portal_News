import { useQueryClient, useMutation } from "@tanstack/react-query";
import { editProfile } from "../api/users";
import { useAuthStore } from "./useAuthStore";

export const useEditProfile = () => {
  const queryClient = useQueryClient();
  const fectUser = useAuthStore((state) => state.fetchUser);

  return useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      fectUser();
    },
  });
};
