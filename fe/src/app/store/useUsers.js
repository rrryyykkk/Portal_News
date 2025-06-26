import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { editProfile, getProfileById } from "../api/users";
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

export const useGetUsersById = (id, options = {}) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getProfileById(id),
    enabled: !!id, // default
    ...options, // bisa override enabled dari luar
  });
};
