import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const useBlabById = (id) => {
    const axiosSecure = useAxiosSecure();
    return useQuery({
        queryKey: ["blab", id],
        enabled: !!id,
        queryFn: async () => {
            const response = await axiosSecure.get(`/blabs/${id}`);
            return response.data.data;
        },
        staleTime: 1000 * 60 * 5,
    });
};

export default useBlabById;
