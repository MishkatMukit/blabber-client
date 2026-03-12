import React from 'react';
import useAxiosSecure from '../Hooks/useAxiosSecure';

const useMyBlabsAPI = () => {
    const axiosSecure = useAxiosSecure()

    const myBlabsPromise = (fb_uid) =>{
        console.log("Fetching blabs for:", fb_uid)
        return axiosSecure.get(`/blabs/${fb_uid}`).then(res=> res.data)
    }
    return myBlabsPromise
};

export default useMyBlabsAPI;