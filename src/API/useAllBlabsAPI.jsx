import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../Hooks/useAxiosPublic";

const useAllBlabsAPI = (page, limit) => useQuery({
  queryKey: ["allBlabs", page],
  queryFn: async () => {
    const response = await axiosPublic.get(`/blabs?page=${page}&limit=${limit}`);
    return response.data;
  },
  placeholderData: (previousData) => previousData,
  staleTime: 1000 * 60 * 5,
});

export default useAllBlabsAPI;
