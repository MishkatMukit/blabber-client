import { use, useState } from 'react';
import Lottie from 'lottie-react';
import { Link, useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { FaRegEyeSlash } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { FcGoogle } from 'react-icons/fc';
import lottieLogin from "../../../assets/Lottie/login.json"
import { AuthContext } from '../../../Provider/AuthProvider';

const Login = () => {
    const [error, setError] = useState("");
    const { logInUser, setUser, googleLogin } = use(AuthContext)
    const [eye, setEye] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const handleGoogleSignIn = () => {
        googleLogin()
            .then((result) => {
                setUser(result.user);
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
    console.log(lottieLogin);
    return (
        <div>
            <div className='flex justify-center items-center mt-5 py-16'>

                    {/* <Lottie className='' animationData={lottieLogin} loop={false}></Lottie> */}
                <div className="card bg-base-100 w-87.5 md:w-lg shrink-0 shadow-lg">
                    <div className="card-body">
                        <h1 className='text-3xl font-bold text-center'>Please Login</h1>
                        <form className='space-y-3' onSubmit={handleLogin}>
                            <div>
                                <p className='text-accent'>Email</p>
                                <input name='email' className='input w-full rounded-md input-bordered' type="text" placeholder='Enter Email' />
                            </div>
                            <div className='relative'>
                                <p className='text-accent'>Password</p>
                                <input name='password' className='input w-full rounded-md input-bordered' type={eye ? "text" : "password"} placeholder='Enter Password' />
                                {
                                    eye ? <FaRegEyeSlash onClick={() => setEye(!eye)} size={18} className='absolute top-8 right-5' /> : <IoEyeOutline onClick={() => setEye(!eye)}
                                        size={18} className='absolute top-8 right-5 ' />
                                }
                            </div>
                            <p className='text-red-800/80 text-sm'>{error}</p>
                            <Link to="/forgetpassword" className='text-secondary underline'>Forgot Password?</Link>
                            <input className='btn btn-secondary shadow-none w-full my-3' type="submit" />
                            <p className='text-center font-medium'>Don't have an account? <Link className=' font-medium text-secondary' to="/register">Register</Link></p>
                        </form>
                        <div className="divider">OR</div>
                        <button onClick={handleGoogleSignIn} className="btn bg-white text-black border-[#e5e5e5]">
                            <FcGoogle />
                            Login with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;