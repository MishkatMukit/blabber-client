import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";

import { createContext, useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase.init";
import { GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
// import axios from "axios";
export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [dbUser, setDbuser] = useState(null)
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
        const unplug = onAuthStateChanged(auth, async(currentUser) => {
            setUser(currentUser)
            if(currentUser){
                const res = await axios.get(`http://localhost:3000/users/${currentUser.uid}`)
                setDbuser(res.data);
            }
            else{
                setDbuser(null)
            }
            setLoading(false)
        })
        return () => {
            unplug();
        }

    }, [])
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