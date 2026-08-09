import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useApplause = (page) => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (blabId) => {
      const response = await axiosSecure.post(`/blabs/${blabId}/applause`);
      return response.data.data;
    },
    onSettled: (_, __, blabId) => {
      queryClient.invalidateQueries({ queryKey: ["allBlabs", page] });
      queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
    },
  });
};

export default useApplause;
