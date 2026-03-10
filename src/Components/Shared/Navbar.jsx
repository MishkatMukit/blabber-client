import React, { useEffect, useRef, useState } from 'react';
import { LiaCrowSolid } from 'react-icons/lia';
import { RiUserSmileFill } from 'react-icons/ri';
import { Link, NavLink } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import { IoIosAdd, IoMdLogIn } from 'react-icons/io';
import { FaPowerOff, FaRegUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
const Navbar = () => {
    const { user, logOutUser } = useAuth()
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    const links = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/allBlabs">Blabs</NavLink></li>
        <li><NavLink title='Add Blubs' to="/addBlubs"><IoIosAdd className='text-xl md:text-2xl bg-primary rounded-xs text-base-200' /></NavLink></li>
        {
            user && <>

            </>
        }
    </>
    useEffect(() => {
        const updateScroll = () => {
            const currentScroll = window.scrollY;

            if (currentScroll < 80) {
                setVisible(true);
            } else if (currentScroll > lastScrollY.current) {
                setVisible(false); // scrolling down
            } else {
                setVisible(true); // scrolling up
            }

            lastScrollY.current = currentScroll;
            ticking.current = false;
        };

        const handleScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScroll);
                ticking.current = true;
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            color: "white",
            showCancelButton: true,
            background: "#111827",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#E11D48",
            confirmButtonText: "Yes, Logout"
        }).then((result) => {
            if (result.isConfirmed) {
                logOutUser().then(res => console.log(res))
                Swal.fire({
                    title: "Logged out",
                    text: "Successfully Logged out from Blabber!",
                    icon: "success",
                    background: "#111827",
                    color: "white"
                });
            }
        });

    }
    return (
        <div className={` fixed  w-full top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}>
            <div className="navbar max-w-[95%] mx-auto bg-white/8 backdrop-blur-2   border border-t-0 border-white/20 shadow-lg rounded-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>

                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

                            {
                                links
                            }

                        </ul>
                    </div>
                    <Link to="/" className="pl-2 text-xl font-levin text-primary">Blabber</Link>
                </div>

                <div className="navbar-end dropdown dropdown-bottom">
                    <div className=" hidden lg:flex ">
                        <ul className="flex gap-4 px-4">
                            {
                                links
                            }
                        </ul>
                    </div>
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />

                            </div>
                        </label>

                        <ul tabIndex={0} className="  menu dropdown-content bg-white/8 backdrop-blur-2 rounded-box  mt-4 ">
                            <li><a>Profile <FaRegUserCircle size={18} /></a></li>
                            <li>
                                {
                                    user ? <button onClick={handleLogout}>Logout<FaPowerOff /></button> : <Link to="/login">Login <IoMdLogIn size={20} /></Link>
                                }
                            </li>
                        </ul>
                    </div>
                </div>

            </div >
        </div >
    );
};

export default Navbar;