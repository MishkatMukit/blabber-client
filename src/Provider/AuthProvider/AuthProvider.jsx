import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

import { createContext, useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase.init";
import { GoogleAuthProvider } from "firebase/auth";
// import axios from "axios";
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const googleProvider = new GoogleAuthProvider();
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
        //setUser(null)
        setLoading(true)
        return signOut(auth)
    }
    useEffect(() => {
        const unplug = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false)
            // if(currentUser?.email){
            //     const userData = {email: currentUser.email}
            //     axios.post("https://career-code-server-three-chi.vercel.app/jwt", userData,{withCredentials: true}).then(res=> console.log(res.data))
            //     .catch(err=>console.log(err))
            // }
        })
        return () => {
            unplug();
        }

    }, [user])
    const authInfo = {
        loading,
        googleProvider,
        registerUser,
        googleLogin,
        logOutUser,
        logInUser,
        user,
        setUser
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;