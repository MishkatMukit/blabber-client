import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useApplauseEchoe = () => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();

    return useMutation({
        mutationFn: async ({ echoId }) => {
            const response = await axiosSecure.post(`/echo/${echoId}/applause`);
            return response.data.data;
        },
        onSettled: (_, __, { blabId }) => {
            queryClient.invalidateQueries({ queryKey: ["echoes", blabId] });
        },
    });
};

export default useApplauseEchoe;
