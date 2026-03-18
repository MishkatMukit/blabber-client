import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const useBlabById = (id) => {
    console.log(id)
    const axiosSecure = useAxiosSecure();
    const query = useQuery({
        queryKey: ["blab", id],
        enabled: !!id,
        queryFn: async () => {
            const res = await axiosSecure.get(`/blabdetails/${id}`);
            return res.data;
        },
        staleTime: 1000 * 60 * 5
    });
    return query;
};

export default useBlabById;