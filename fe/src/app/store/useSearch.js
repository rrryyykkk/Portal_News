import { useQuery } from "@tanstack/react-query";
import { search } from "../api/search";

// get search news + user
export const useSearch = (keyword) => {
  return useQuery({
    queryKey: ["search", keyword],
    queryFn: () => search(keyword),
    enabled: !!keyword,
  });
};
