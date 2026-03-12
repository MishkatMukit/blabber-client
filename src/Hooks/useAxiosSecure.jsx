import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000'
})

const useAxiosSecure = () => {
    const {user, logOutUser } = useAuth()
    const navigate = useNavigate()
     
    axiosInstance.interceptors.request.use(config=>{
        config.headers.authorization =  `Bearer ${user.accessToken}`
        return config
    })
    axiosInstance.interceptors.response.use(
        res => res,
        err => {
            const status = err?.response?.status;
            if (status === 401 || status === 403) {
                logOutUser()
                    .then(() => {
                        console.log("Session expired → logout");
                        navigate("/login")
                    })
                    .catch(console.error);
            }

            return Promise.reject(err);
        }
    );
    return axiosInstance
};

export default useAxiosSecure;