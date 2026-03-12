import React, { use, useState } from 'react';
import { AuthContext } from '../../Provider/AuthProvider/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import lottieLogin from "../../assets/login.json"
import { IoEyeOutline } from 'react-icons/io5';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import axios from 'axios';
const Login = () => {
    const [error, setError] = useState("");
    const { logInUser, setUser, googleLogin } = use(AuthContext)
    const [eye, setEye] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const handleGoogleSignIn = () => {
        googleLogin()
            .then((res) => {
                const userInfo ={ 
                fb_uid: res.user.uid,
                email : res.user.email,
                userName: res.user.displayName?.toLowerCase().replace(/\s+/g, "_"),
            }
                axios.post('http://localhost:3000/users', userInfo).then(res=>console.log(res.data))
                setUser(res.user);
                navigate(location.state ? location.state : "/")
            })
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };

    const handleLogin = (e) => {
        setError("")
        e.preventDefault();
        const form = e.target
        const formData = new FormData(form)
        const email = formData.get("email")
        const password = formData.get("password")
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }
        console.log(email, password);
        logInUser(email, password).then((result) => {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "SignIn successful",
                showConfirmButton: false,
                timer: 1500
            });
            setUser(result)
            // navigate("/")
            navigate(location.state ? location.state : "/")
        }).catch(() => setError("Invalid email or password combination"))

    }
    return (
        <div>
            <div>
            <div className='flex justify-center items-center  py-20'>
                <div>
                    <Lottie className='w-sm' animationData={lottieLogin} loop={false}></Lottie>
                </div>
                <div className="card bg-base-100 w-87.5 md:w-lg shrink-0 shadow-lg">
                    <div className="card-body">
                        <h1 className='text-3xl font-medium text-center'>Please Login</h1>
                        <form className='space-y-3' onSubmit={handleLogin}>
                            <div>
                                <p className='text-accent'>Email</p>
                                <input required name='email' className='input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary' type="text" placeholder='Enter Email' />
                            </div>
                            <div className='relative'>
                                <p className='text-accent'>Password</p>
                                <input required name='password' className='input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary' type={eye ? "text" : "password"} placeholder='Enter Password' />
                                {
                                    eye ? <FaRegEyeSlash onClick={() => setEye(!eye)} size={18} className='absolute top-8 right-5' /> : <IoEyeOutline onClick={() => setEye(!eye)}
                                        size={18} className='absolute top-8 right-5 ' />
                                }
                            </div>
                            <p className='text-basse-200 text-sm'>{error}</p>
                            <Link to="/forgetpassword" className='text-base-200 underline'>Forgot Password?</Link>
                            <input className='btn btn-primary shadow-none w-full my-3' type="submit" />
                            <p className='text-center text-base-200 font-medium'>Don't have an account? <Link className=' font-medium text-primary' to="/register">Register</Link></p>
                        </form>
                        <div className="divider">OR</div>
                        <button onClick={handleGoogleSignIn} className="btn bg-base-200 text-black border-[#e5e5e5]">
                            <FcGoogle />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default Login;