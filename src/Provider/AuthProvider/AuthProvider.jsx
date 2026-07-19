import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

import { createContext, useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase.init";
import { GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import axiosPublic from "../../Hooks/useAxiosPublic";
import useDbUser from "../../Hooks/useDbUser";
// import axios from "axios";
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dbUser, setDbuser] = useState(null)
    const googleProvider = new GoogleAuthProvider();
    const { data: queriedDbUser, isLoading: isDbUserLoading } = useDbUser(user?.uid);

    // console.log(googleProvider)
    const registerUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const googleLogin = () => {
        return signInWithPopup(auth, googleProvider);
    }
    const logInUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const logOutUser = () => {
        setUser(null)
        setLoading(true)
        return signOut(auth)
    }

    useEffect(() => {
        const unplug = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            if (!currentUser) {
                setDbuser(null)
                setLoading(false)
                return
            }
        })
        return () => {
            unplug();
        }
    }, [])
    useEffect(() => {
        if (!user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(true)
            return
        }
        if (isDbUserLoading) {
            setLoading(true)
        } else {
            setDbuser(queriedDbUser || null)
            setLoading(false)
        }
    }, [queriedDbUser, isDbUserLoading, user])
    const authInfo = {
        loading,
        googleProvider,
        registerUser,
        googleLogin,
        logOutUser,
        logInUser,
        user,
        setUser,
        dbUser,
        setDbuser
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;