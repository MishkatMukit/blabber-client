import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { IoEyeOutline } from 'react-icons/io5';
import { FaRegEyeSlash } from 'react-icons/fa';
import useAuth from '../../Hooks/useAuth';
import useRegisterValidation from '../../Hooks/useRegisterValidation';
import useDebounce from '../../Hooks/useDebounce';
import axiosPublic from '../../Hooks/useAxiosPublic';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
const Register = () => {
    const [eye, setEye] = useState(false)
    const [conEye, setConEye] = useState(false)
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [usernameTaken, setUsernameTaken] = useState(false)
    const [checkingUsername, setCheckingUsername] = useState(false)
    const debouncedUsername = useDebounce(username, 400)
    const { registerUser } = useAuth()
    const { error, setError, validateForm } = useRegisterValidation()

    const navigate = useNavigate()

    useEffect(() => {
        const q = debouncedUsername.trim()
        if (
            q.length < 2 ||
            q.length > 20 ||
            !/^[a-zA-Z0-9_]+$/.test(q) ||
            q.includes("__") ||
            q.startsWith("_") ||
            q.endsWith("_") ||
            q.includes(" ")
        ) {
            setUsernameTaken(false)
            setCheckingUsername(false)
            return
        }

        let cancelled = false
        setCheckingUsername(true)
        axiosPublic.get(`/auth/check-username?userName=${encodeURIComponent(q)}`)
            .then(res => { if (!cancelled) setUsernameTaken(res.data?.data?.available === false) })
            .catch(() => { if (!cancelled) setUsernameTaken(false) })
            .finally(() => { if (!cancelled) setCheckingUsername(false) })

        return () => { cancelled = true }
    }, [debouncedUsername])

    const handleRegister = (e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form)

        const userName = formData.get("userName")
        const email = formData.get("email");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (!validateForm(userName, password, confirmPassword)) {
            return
        }

        if (usernameTaken) {
            setError("Username is already taken")
            return
        }

        setLoading(true);
        registerUser(
            userName,
            email,
            password,
            `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`
        ).then(() => {
            toast.success('Successfully Registered');
            navigate("/allBlabs")
        }).catch((error) => {
            setError(error.response?.data?.message || error.message || "Registration failed");
        }).finally(() => {
            setLoading(false);
        });

    }
    return (
        <div>
            <div className='flex justify-center items-center pt-16 pb-10 min-h-screen px-4 md:px-0'>
                <div className="card bg-base-100 w-full max-w-sm md:w-lg shrink-0 shadow-lg">
                    <div className="card-body">
                        <h1 className='text-3xl font-bold text-center'>Please Register</h1>
                        <form onSubmit={handleRegister} className='space-y-3' >
                            <div>
                                <p className='text-muted-foreground'>Username</p>
                                <Input
                                    required
                                    name='userName'
                                    type="text"
                                    placeholder='Enter Name'
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={usernameTaken ? 'border-destructive' : ''}
                                />
                                {checkingUsername && !usernameTaken && (
                                    <p className='mt-1 text-sm text-muted-foreground'>Checking username...</p>
                                )}
                                {usernameTaken && (
                                    <p className='mt-1 text-sm text-destructive'>Username is already taken</p>
                                )}
                            </div>
                            {/* <div>
                                <p className='text-muted-foreground'>Phone</p>
                                <Input name='phone' type="text" placeholder='Enter Phone Number' />
                            </div> */}
                            {/* <div>
                                <p className='text-muted-foreground'>Address</p>
                                <Input name='address' type="text" placeholder='Enter Address' />
                            </div> */}
                            <div>
                                <p className='text-muted-foreground'>Email</p>
                                <Input required name='email' type="email" placeholder='Enter Email' />
                            </div>
                            <div className='relative'>
                                <p className='text-muted-foreground'>Password</p>
                                <Input name='password' type={eye ? "text" : "password"} placeholder='Enter Password' className='pr-10' />
                                {
                                    eye ? <FaRegEyeSlash onClick={() => setEye(!eye)} size={18} className='absolute top-8 right-3' /> : <IoEyeOutline onClick={() => setEye(!eye)}
                                        size={18} className='absolute top-8 right-3 ' />
                                }
                            </div>
                            <div className='relative'>
                                <p className='text-muted-foreground'>Confirm Password</p>
                                <Input name='confirmPassword' type={conEye ? "text" : "password"} placeholder='Confirm your Password' className='pr-10' />
                                {
                                    conEye ? <FaRegEyeSlash onClick={() => setConEye(!conEye)} size={18} className='absolute top-8 right-3' /> : <IoEyeOutline onClick={() => setConEye(!conEye)}
                                        size={18} className='absolute top-8 right-3 ' />
                                }
                            </div>
                            <p className='text-destructive font-light text-sm'>{error}</p>

                            <Button type="submit" size="lg" className="w-full my-3" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Registering...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </Button>
                            <p className='text-center font-medium'>Don't have an account? <Link className=' font-medium text-primary' to="/login">Login</Link></p>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;