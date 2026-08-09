import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import useAuth from "../Hooks/useAuth";

const useMyBlabsAPI = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser } = useAuth();

  return useQuery({
    queryKey: ["myBlabs", dbUser?.id],
    enabled: !!dbUser?.id,
    queryFn: async () => {
      const response = await axiosSecure.get(`/blabs?authorId=${dbUser.id}`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useMyBlabsAPI;
