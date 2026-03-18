import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useApplause = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (blabId) => {
      const res = await axiosSecure.patch(`/blabs/applause/${blabId}`);
      return res.data;
    },

    onMutate: async (blabId) => {
      await queryClient.cancelQueries();
      const previousAllBlabs = queryClient.getQueryData(["allBlabs"]);
      const previousMyBlabs = queryClient.getQueryData(["myBlabs"]);

      const updateBlabs = ((oldBlabs) => {
        return oldBlabs?.map((blab) => {
          if (blab._id === blabId) {
            const alreadyApplauded = blab.applause?.includes(user.uid);
            return {
              ...blab,
              applauseCount: alreadyApplauded
                ? blab.applauseCount - 1
                : blab.applauseCount + 1,
              applause: alreadyApplauded
                ? blab.applause.filter((id) => id !== user.uid)
                : [...blab.applause, user.uid],
            };
          }
          return blab;
        });
      });
      queryClient.setQueryData(["allBlabs"], updateBlabs)
      queryClient.setQueryData(["myBlabs", user?.uid], updateBlabs)
      return { previousAllBlabs, previousMyBlabs };
    },
    onError: (err, blabId, context) => {
      queryClient.setQueryData(["allBlabs"], context.previousAllBlabs);
      queryClient.setQueryData(["myBlabs", user?.uid], context.previousMyBlabs);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
      queryClient.invalidateQueries({ queryKey: ["myBlabs", user?.uid] });
    },
  });
};

export default useApplause;