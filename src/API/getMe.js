import axiosPublic from "../Hooks/useAxiosPublic";

const getMe = async () => {
  try {
    const response = await axiosPublic.get("/auth/profile", { skipAuthRedirect: true });
    return response.data?.data ?? null;
  } catch {
    return null;
  }
};

export default getMe;
