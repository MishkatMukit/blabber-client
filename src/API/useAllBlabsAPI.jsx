import { useQuery } from "@tanstack/react-query";
import axiosPublic from "../Hooks/useAxiosPublic";

const useAllBlabsAPI = (page, limit) => {

  const query = useQuery({
    queryKey: ["allBlabs", page],

    queryFn: async () => {
      const res = await axiosPublic.get(`/blabs?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return query;
};

export default useAllBlabsAPI;