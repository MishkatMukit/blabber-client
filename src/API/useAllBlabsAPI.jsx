import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAllBlabsAPI = () => {

  const query = useQuery({
    queryKey: ["allBlabs"],
    
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/blabs");
      return res.data;
    },

    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return query;
};

export default useAllBlabsAPI;