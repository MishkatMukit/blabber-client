import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const toggleApplause = (echoe) => ({
  ...echoe,
  applauded: !echoe.applauded,
  _count: {
    ...echoe._count,
    applause: (echoe._count?.applause ?? 0) + (echoe.applauded ? -1 : 1),
  },
});

const useApplauseEchoe = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    return useMutation({
        mutationFn: async ({ echoId }) => {
            const response = await axiosSecure.post(`/echo/${echoId}/applause`);
            return response.data.data;
        },
        onMutate: async ({ echoId, blabId }) => {
            await queryClient.cancelQueries({ queryKey: ["echoes", blabId] });

            const previous = queryClient.getQueryData(["echoes", blabId]);

            queryClient.setQueryData(["echoes", blabId], (old) => {
                if (!Array.isArray(old)) return old;
                return old.map((echoe) =>
                    echoe.id === echoId ? toggleApplause(echoe) : echoe
                );
            });

            return { previous, blabId };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["echoes", context.blabId], context.previous);
            }
        },
        onSettled: (_data, _error, { blabId }) => {
            queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
        },
    });
};

export default useApplauseEchoe;