import React, { use, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../Provider/AuthProvider/AuthProvider';
import { IoEyeOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import lottieRegister from "../../assets/register.json"
import Lottie from 'lottie-react';
import { FaRegEyeSlash } from 'react-icons/fa';
import useAuth from '../../Hooks/useAuth';
const Register = () => {
    const [error, setError] = useState()
    const [eye, setEye] = useState(false)
    const [conEye, setConEye] = useState(false)
    const { registerUser, user, setUser } = useAuth()
    const navigate = useNavigate()
    const handleRegister = (e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)

        const userName = formData.get("userName")
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasMinLength = /.{6,}/;
        const isUnique =  /^(?!.*__)[a-zA-Z0-9](?:[a-zA-Z0-9_]{1,18}[a-zA-Z0-9])?$/
        if(!isUnique.test(userName)){
            setError("Username must be unique")
            return
        }
        if (!hasMinLength.test(password)) {
            setError("Password must be at least 6 characters")
            return
        }
        if (!hasLowercase.test(password)) {
            setError("Password must have atleast one lowercase letter")
            return
        }
        if (!hasUppercase.test(password)) {
            setError("Password must have atleast one uppercase letter")
            return
        }
        if (password !== confirmPassword) {
            setError("Confirm Password not matched")
            return
        }
        setError("")
        registerUser(email, password).then((res) => {
            //console.log(res);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Successfully Registered",
                showConfirmButton: false,
                timer: 1500
            });
            setUser(res.user)
            //console.log(res.user)
            navigate("/")
        }).catch((error) => {
            // console.error(error);
            setError(error.message || "Registration failed");
        });

    }
    return (
        <div>
            <div className='flex justify-center items-end mt-5 py-16'>
                <div>
                    <Lottie className="w-sm" animationData={lottieRegister} loop={true}></Lottie>
                </div>
                <div className="card bg-base-100 w-87.5 md:w-lg shrink-0 shadow-lg">
                    <div className="card-body">
                        <h1 className='text-3xl font-bold text-center'>Please Register</h1>
                        <form onSubmit={handleRegister} className='space-y-3' >
                            <div>
                                <p className='text-accent'>Username</p>
                                <input required name='userName' className='input w-full rounded-md input-bordered' type="text" placeholder='Enter Name' />
                            </div>
                            {/* <div>
                                <p className='text-accent'>Phone</p>
                                <input name='phone' className='input w-full rounded-md input-bordered' type="text" placeholder='Enter Phone Number' />
                            </div> */}
                            {/* <div>
                                <p className='text-accent'>Address</p>
                                <input name='address' className='input w-full rounded-md input-bordered' type="text" placeholder='Enter Address' />
                            </div> */}
                            <div>
                                <p className='text-accent'>Email</p>
                                <input required name='email' className='input w-full rounded-md input-bordered' type="text" placeholder='Enter Email' />
                            </div>
                            <div className='relative'>
                                <p className='text-accent'>Password</p>
                                <input name='password' className='input w-full rounded-md input-bordered' type={eye ? "text" : "password"} placeholder='Enter Password' />
                                {
                                    eye ? <FaRegEyeSlash onClick={() => setEye(!eye)} size={18} className='absolute top-8 right-5' /> : <IoEyeOutline onClick={() => setEye(!eye)}
                                        size={18} className='absolute top-8 right-5 ' />
                                }
                            </div>
                            <div className='relative'>
                                <p className='text-accent'>Confirm Password</p>
                                <input name='confirmPassword' className='input w-full rounded-md input-bordered' type={conEye ? "text" : "password"} placeholder='Confirm your Password' />
                                {
                                    conEye ? <FaRegEyeSlash onClick={() => setConEye(!conEye)} size={18} className='absolute top-8 right-5' /> : <IoEyeOutline onClick={() => setConEye(!conEye)}
                                        size={18} className='absolute top-8 right-5 ' />
                                }
                            </div>
                            <p className='text-base-200 font-light text-sm'>{error}</p>

                            <input className='btn btn-primary shadow-none w-full my-3' type="submit" value="Register" />
                            <p className='text-center font-medium'>Don't have an account? <Link className=' font-medium text-primary' to="/login">Login</Link></p>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;