import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const useEchoesAPI = (id) => {
    const axiosSecure = useAxiosSecure();
    const query = useQuery({
        queryKey: ["echoes", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/blab/echoes/${id}`);
            return res.data;
        },


    });
    return query;
};

export default useEchoesAPI;