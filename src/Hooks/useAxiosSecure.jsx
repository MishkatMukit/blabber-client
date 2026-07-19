import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosInstance = axios.create({
  baseURL: "https://blabber-server.vercel.app/",
  // baseURL:"http://localhost:3000"
});

const useAxiosSecure = () => {
  const { user, logOutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (user) {
          const token = await user.getIdToken();   // ✅ correct token
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;

        if (status === 401 || status === 403) {
          console.log("Session expired → logout");

          logOutUser()
            .then(() => navigate("/login"))
            .catch(console.error);
        }

        return Promise.reject(err);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };

  }, [user, logOutUser, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;