import axios from "axios";

const axiosPublic = axios.create({
    baseURL: "https://blabber-server.vercel.app/",
    // baseURL: 'http://localhost:3000'
});

export default axiosPublic;
