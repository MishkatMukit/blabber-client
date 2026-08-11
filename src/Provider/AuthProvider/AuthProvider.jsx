import { createContext, useCallback, useEffect, useRef, useState } from "react";
import axiosPublic from "../../Hooks/useAxiosPublic";
import getMe from "../../API/getMe";
import socket from "../../Hooks/socket";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// Access token lives 1d on the server; refresh it well before expiry
// so idle sessions stay alive for the full refresh-token lifetime (7d).
const REFRESH_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [dbUser, setDbuser] = useState(null);
    const [loading, setLoading] = useState(true);
    const isLoggedInRef = useRef(false);

    const applySession = (session) => {
        const currentUser = session?.user || session || null;
        setUser(currentUser);
        setDbuser(currentUser?.profile || null);
        isLoggedInRef.current = Boolean(currentUser);
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
            isLoggedInRef.current = false;
            setUser(null);
            setDbuser(null);
        }
    };

    const silentRefresh = useCallback(async () => {
        if (!isLoggedInRef.current) return;
        try {
            await axiosPublic.post("/auth/refresh-token", {}, { skipAuthRedirect: true });
        } catch {
            // Refresh token expired or revoked; session is over.
            await logOutUser();
        }
    }, []);
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

    // Keep the session alive through idle periods: refresh on a timer,
    // and refresh immediately when the tab becomes visible again after
    // being hidden (the common "left the app open" scenario).
    useEffect(() => {
        const refresh = () => {
            if (document.visibilityState === "visible") silentRefresh();
        };

        const intervalId = setInterval(refresh, REFRESH_INTERVAL_MS);
        document.addEventListener("visibilitychange", refresh);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", refresh);
        };
    }, [silentRefresh]);

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
