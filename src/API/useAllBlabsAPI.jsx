import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../Hooks/useAxiosPublic";

const useAllBlabsAPI = (page, limit, search = "") => useQuery({
  queryKey: ["allBlabs", page, search],
  queryFn: async () => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.set("search", search);
    const response = await axiosPublic.get(`/blabs?${params}`);
    return response.data;
  },
  placeholderData: (previousData) => previousData,
  staleTime: 1000 * 60 * 5,
});

export default useAllBlabsAPI;
