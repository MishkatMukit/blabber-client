import axiosPublic from "../Hooks/useAxiosPublic";

const getMe = async () => {
  try {
    const response = await axiosPublic.get("/auth/profile", { skipAuthRedirect: true });
    return response.data?.data ?? null;
  } catch {
    // Access token may be expired while the refresh token is still valid.
    // Try a silent refresh once before giving up.
    try {
      await axiosPublic.post("/auth/refresh-token", {}, { skipAuthRedirect: true });
      const response = await axiosPublic.get("/auth/profile", { skipAuthRedirect: true });
      return response.data?.data ?? null;
    } catch {
      return null;
    }
  }
};

export default getMe;
