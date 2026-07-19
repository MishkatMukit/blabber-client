import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";

const useMyBlabsAPI = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["myBlabs", user?.uid],
    enabled: !!user?.uid,
    queryFn: async () => {
      const res = await axiosSecure.get(`/blabs/${user.uid}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 5
  });

  return query;
};

export default useMyBlabsAPI;