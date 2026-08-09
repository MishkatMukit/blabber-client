import { useEffect } from "react";
import { useNavigate } from "react-router";
import axiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";

const useAxiosSecure = () => {
  const { logOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let refreshing = null;

    const responseInterceptor = axiosPublic.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalConfig = error.config;

        if (error?.response?.status === 401 && !originalConfig?.skipAuthRedirect && !originalConfig?._retried) {
          try {
            refreshing =
              refreshing ||
              axiosPublic.post("/auth/refresh-token", {});

            await refreshing;
            originalConfig._retried = true;
            return axiosPublic(originalConfig);
          } catch (refreshError) {
            await logOutUser();
            navigate("/login");
            return Promise.reject(refreshError);
          } finally {
            refreshing = null;
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axiosPublic.interceptors.response.eject(responseInterceptor);
  }, [logOutUser, navigate]);

  return axiosPublic;
};

export default useAxiosSecure;
