import { createContext, useEffect, useState } from "react";
import axiosPublic from "../../Hooks/useAxiosPublic";
import getMe from "../../API/getMe";
import socket from "../../Hooks/socket";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbuser] = useState(null);
    const [loading, setLoading] = useState(true);

    const applySession = (session) => {
        const currentUser = session?.user || session || null;
        setUser(currentUser);
        setDbuser(currentUser?.profile || null);
        if (currentUser) {
            socket.connect();
        }
        return currentUser;
    };

    const registerUser = async (name, email, password, profilePhoto) => {
        const response = await axiosPublic.post("/auth/register", {
            name,
            email,
            password,
            ...(profilePhoto ? { profilePhoto } : {}),
        });
        applySession(response.data.data);
        return response.data.data;
    };

    const logInUser = async (email, password) => {
        const response = await axiosPublic.post("/auth/login", { email, password });
        applySession(response.data.data);
        return response.data.data;
    };

    const logOutUser = async () => {
        try {
            await axiosPublic.post("/auth/logout", {});
        } catch {
            // logout is stateless; clear local state regardless
        } finally {
            socket.disconnect();
            setUser(null);
            setDbuser(null);
        }
    };
    useEffect(() => {
        let active = true;
        getMe()
            .then((me) => {
                if (active && me) applySession(me);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const authInfo = {
        loading,
        registerUser,
        logOutUser,
        logInUser,
        user,
        setUser,
        dbUser,
        setDbuser,
    };

    return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
