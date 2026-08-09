import { useQuery } from "@tanstack/react-query";
import axiosPublic from "./useAxiosPublic";

const useDbUser = (uid) => {
  return useQuery({
    queryKey: ["dbUser", uid],
    queryFn: async () => {
      const res = await axiosPublic.get(`/users/${uid}`);
      return res.data;
    },
    enabled: !!uid,
    retry: 5,
    retryDelay: () => 500, // 500ms between retries
  });
};

export default useDbUser;
