import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const useEchoesAPI = (id, enabled = true) => {
    const axiosSecure = useAxiosSecure();
    return useQuery({
        queryKey: ["echoes", id],
        enabled: enabled && !!id,
        queryFn: async () => {
            const response = await axiosSecure.get(`/echo/blab/${id}`);
            return response.data.data;
        },
    });
};

export default useEchoesAPI;
