import React, { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import lottieLogin from "../../assets/login.json"
import { IoEyeOutline } from 'react-icons/io5';
import { FaRegEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Swal from 'sweetalert2';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Login = () => {
    const [error, setError] = useState("");
    const { logInUser } = useAuth()
    const [eye, setEye] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const handleLogin = async(e) => {
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
        // console.log(email, password);
        try {
            await logInUser(email, password)
            Swal.fire({
                position: "center",
                icon: "success",
                title: "SignIn successful",
                showConfirmButton: false,
                timer: 1500
            });
            navigate(location.state?.pathname || "/allBlabs")
        } catch (error) {
            setError(error.response?.data?.message || "Invalid email or password combination")
        }

    }
    return (
        <div>
            <div>
                <div className='flex justify-center items-center py-10 md:py-20 min-h-screen px-4 md:px-0'>
                    <div className='hidden md:flex'>
                        <Lottie className='w-sm' animationData={lottieLogin} loop={false}></Lottie>
                    </div>
                    <div className="card bg-base-100 w-full max-w-sm md:w-lg shrink-0 shadow-lg">
                        <div className="card-body">
                            <h1 className='text-3xl font-medium text-center'>Please Login</h1>
                            <form className='space-y-3' onSubmit={handleLogin}>
                                <div>
                                    <p className='text-muted-foreground'>Email</p>
                                    <Input required name='email' type="text" placeholder='Enter Email' />
                                </div>
                                <div className='relative'>
                                    <p className='text-muted-foreground'>Password</p>
                                    <Input required name='password' type={eye ? "text" : "password"} placeholder='Enter Password' className='pr-10' />
                                    {
                                        eye ? <FaRegEyeSlash onClick={() => setEye(!eye)} size={18} className='absolute top-8 right-3' /> : <IoEyeOutline onClick={() => setEye(!eye)}
                                            size={18} className='absolute top-8 right-3 ' />
                                    }
                                </div>
                                <p className='text-base-200 text-sm'>{error}</p>
                                <Link to="/forgetpassword" className='text-base-200 underline'>Forgot Password?</Link>
                                <Button type="submit" size="lg" className="w-full my-3">Login</Button>
                                <p className='text-center text-base-200 font-medium'>Don't have an account? <Link className=' font-medium text-primary' to="/register">Register</Link></p>
                            </form>
                            <div className="divider">OR</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;