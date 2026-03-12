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
      await queryClient.cancelQueries({ queryKey: ["allBlabs"] });

      const previousBlabs = queryClient.getQueryData(["allBlabs"]);

      queryClient.setQueryData(["allBlabs"], (oldBlabs) => {
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

      return { previousBlabs };
    },

    onError: (err, blabId, context) => {
      queryClient.setQueryData(["allBlabs"], context.previousBlabs);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allBlabs"] });
      queryClient.invalidateQueries({ queryKey: ["myBlabs"] });
    },
  });
};

export default useApplause;