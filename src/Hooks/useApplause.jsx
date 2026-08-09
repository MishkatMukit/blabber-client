import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const toggleApplause = (blab) => ({
  ...blab,
  applauded: !blab.applauded,
  _count: {
    ...blab._count,
    applause: (blab._count?.applause ?? 0) + (blab.applauded ? -1 : 1),
  },
});

const useApplause = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  return useMutation({
    mutationFn: async (blabId) => {
      const response = await axiosSecure.post(`/blabs/${blabId}/applause`);
      return response.data.data;
    },
    onMutate: async (blabId) => {
      await queryClient.cancelQueries({ queryKey: ["allBlabs"] });
      await queryClient.cancelQueries({ queryKey: ["blab", blabId] });
      await queryClient.cancelQueries({ queryKey: ["myBlabs"] });

      const previous = {
        allBlabs: queryClient.getQueriesData({ queryKey: ["allBlabs"] }),
        blab: queryClient.getQueryData(["blab", blabId]),
        myBlabs: queryClient.getQueriesData({ queryKey: ["myBlabs"] }),
      };

      queryClient.setQueriesData({ queryKey: ["allBlabs"] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((blab) => (blab.id === blabId ? toggleApplause(blab) : blab)),
        };
      });

      queryClient.setQueriesData({ queryKey: ["myBlabs"] }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map((blab) => (blab.id === blabId ? toggleApplause(blab) : blab));
      });

      queryClient.setQueryData(["blab", blabId], (old) =>
        old ? toggleApplause(old) : old
      );

      return previous;
    },
    onError: (_err, blabId, context) => {
      context?.allBlabs.forEach(([queryKey]) => {
        queryClient.invalidateQueries({ queryKey });
      });
      context?.myBlabs.forEach(([queryKey]) => {
        queryClient.invalidateQueries({ queryKey });
      });
      queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
    },
    onSettled: (_data, _error, blabId) => {
      queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
      queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
      queryClient.invalidateQueries({ queryKey: ["myBlabs"] });
    },
  });
};

export default useApplause;