import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useApplause = (page) => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const toggleApplause = (blab, userId) => {
    if (!blab) return blab;

    const alreadyApplauded = blab.applause?.includes(userId);

    const updatedApplause = alreadyApplauded
      ? blab.applause.filter((id) => id !== userId)
      : [...blab.applause, userId];

    return {
      ...blab,
      applause: updatedApplause,
      applauseCount: alreadyApplauded
        ? Math.max((blab.applauseCount || 1) - 1, 0)
        : (blab.applauseCount || 0) + 1,
    };
  };

  return useMutation({
    mutationFn: async (blabId) => {
      const res = await axiosSecure.patch(`/blabs/applause/${blabId}`);
      return res.data;
    },

    onMutate: async (blabId) => {
      await queryClient.cancelQueries({ queryKey: ["allBlabs", page] });
      await queryClient.cancelQueries({ queryKey: ["myBlabs", user?.uid] });
      await queryClient.cancelQueries({ queryKey: ["blab", blabId] });

      const previousAllBlabs = queryClient.getQueryData(["allBlabs", page]);
      const previousMyBlabs = queryClient.getQueryData(["myBlabs", user?.uid]);
      const previousBlabById = queryClient.getQueryData(["blab", blabId]);

      // update blab array (cache shape is { data: [...], totalPages: N })
      const updateBlabs = (oldBlabs) => {
        if (!oldBlabs) return oldBlabs;

        // 🔥 CASE 1: paginated (allBlabs)
        if (oldBlabs.data) {
          return {
            ...oldBlabs,
            data: oldBlabs.data.map((blab) =>
              blab._id === blabId
                ? toggleApplause(blab, user.uid)
                : blab
            ),
          };
        }

        // 🔥 CASE 2: non-paginated (myBlabs)
        if (Array.isArray(oldBlabs)) {
          return oldBlabs.map((blab) =>
            blab._id === blabId
              ? toggleApplause(blab, user.uid)
              : blab
          );
        }

        return oldBlabs;
      };

      queryClient.setQueryData(["allBlabs", page], updateBlabs);
      queryClient.setQueryData(["myBlabs", user?.uid], updateBlabs);

      // update single blab
      queryClient.setQueryData(["blab", blabId], (oldBlab) =>
        toggleApplause(oldBlab, user.uid)
      );

      return {
        previousAllBlabs,
        previousMyBlabs,
        previousBlabById,
      };
    },

    onError: (err, blabId, context) => {
      queryClient.setQueryData(["allBlabs", page], context.previousAllBlabs);
      queryClient.setQueryData(["myBlabs", user?.uid], context.previousMyBlabs);
      queryClient.setQueryData(["blab", blabId], context.previousBlabById);
    },

    onSettled: (data, error, blabId) => {
      queryClient.invalidateQueries({ queryKey: ["allBlabs", page] });
      queryClient.invalidateQueries({ queryKey: ["myBlabs", user?.uid] });
      queryClient.invalidateQueries({ queryKey: ["blab", blabId] });
    },
  });
};

export default useApplause;