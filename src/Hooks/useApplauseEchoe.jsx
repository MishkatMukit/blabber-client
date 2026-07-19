import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useApplauseEchoe = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const toggleApplause = (echo, userId) => {
        if (!echo) return echo;
        const alreadyApplauded = echo.applause?.includes(userId);
        const updatedApplause = alreadyApplauded
            ? echo.applause.filter((id) => id !== userId)
            : [...echo.applause, userId];

        return {
            ...echo,
            applause: updatedApplause,
            applauseCount: updatedApplause.length,
        };
    };

    return useMutation({
        mutationFn: async ({ echoId }) => {
            const res = await axiosSecure.patch(`/echoe/applause/${echoId}`);
            return res.data;
        },

        onMutate: async ({ echoId, blabId }) => {
            await queryClient.cancelQueries({ queryKey: ["echoes", blabId] });

            const previousEchoes = queryClient.getQueryData(["echoes", blabId]);

            // optimistically update the echo list
            queryClient.setQueryData(["echoes", blabId], (oldEchoes) =>
                oldEchoes?.map((echo) =>
                    echo._id === echoId ? toggleApplause(echo, user.uid) : echo)
            );
            return { previousEchoes, blabId };
        },

        onError: (err, vars, context) => {
            queryClient.setQueryData(["echoes", context.blabId], context.previousEchoes);
        },

        onSettled: (data, error, { blabId }) => {
            queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
        },
    });
};

export default useApplauseEchoe;