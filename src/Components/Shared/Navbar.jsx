import React, { useEffect, useRef, useState } from 'react';
import { LiaCrowSolid } from 'react-icons/lia';
import { RiUserSmileFill } from 'react-icons/ri';
import { Link, NavLink } from 'react-router';
import useAuth from '../../Hooks/useAuth';
import { IoIosAdd, IoMdLogIn } from 'react-icons/io';
import { FaBars, FaPowerOff, FaRegUserCircle } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';
import logo from '../../assets/logo.png';
import { toast } from 'react-toastify';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
const Navbar = () => {
    const { user, dbUser, logOutUser } = useAuth()
    const [visible, setVisible] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const lastScrollY = useRef(0);
    const ticking = useRef(false);
    const queryClient = useQueryClient()
    // const links = <>
    //     <li className='font-light  p-1' ><NavLink to="/">Home</NavLink></li>
    //     <li className='font-light  p-1'><NavLink to="/allBlabs">Blabs</NavLink></li>
    //     {/* <li><NavLink title='Add Blubs' to="/addBlabs"><IoIosAdd className='text-xl md:text-2xl bg-primary rounded-xs text-base-200' /></NavLink></li> */}

    // </>
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
    const handleLogout = async () => {
        await logOutUser()
        queryClient.clear();
        setShowLogoutConfirm(false);
        toast.success("Successfully Logged out from Blabber!");
    }
    return (
        <div className={` fixed  w-full top-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
            }`}>
            <div className="navbar max-w-[95%] mx-auto bg-white/8 backdrop-blur-2xl   border border-t-0 border-white/20 shadow-lg rounded-sm">
                <div className="navbar-start">
                    <Link to="/allBlabs" className="md:hidden">
                        <img src={logo} alt="Blabber Logo" className="h-8 w-8" />
                    </Link>
                    <Link to="/allBlabs" className="hidden  font-semibold md:block md:pl-2 text-xl font-roboto text-primary"><img src={logo} alt="Blabber Logo" className="h-8 w-8 inline" />Blabber</Link>
                </div>

                <div className="navbar-end flex items-center gap-2">
                    <ul className="flex items-center gap-4">
                        {
                            !user && <li className='font-light p-1'>
                                <NavLink to="/" className={({ isActive }) =>
                                    isActive
                                        ? 'text-primary font-medium drop-shadow-[0_0_8px_var(--color-primary)] transition-all duration-200'
                                        : 'transition-all duration-200 hover:text-primary/70'
                                }>Home</NavLink>
                            </li>
                        }
                        {
                            user && <li className='font-light p-1'>
                                <NavLink to="/chat" className={({ isActive }) =>
                                    isActive
                                        ? 'text-primary font-medium drop-shadow-[0_0_8px_var(--color-primary)] transition-all duration-200'
                                        : 'transition-all duration-200 hover:text-primary/70'
                                }>Chat</NavLink>
                            </li>
                        }
                        <li className='font-light p-1'>
                            <NavLink to="/allBlabs" className={({ isActive }) =>
                                isActive
                                    ? 'text-primary font-medium drop-shadow-[0_0_8px_var(--color-primary)] transition-all duration-200'
                                    : 'transition-all duration-200 hover:text-primary/70'
                            }>Blabs</NavLink>
                        </li>
                    </ul>
                    <div className="dropdown dropdown-end mx-2">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <Avatar className="size-8"  >
                                <AvatarImage
                                    alt="User avatar"
                                    src={
                                        dbUser? dbUser?.photo ||
                                        `https://api.dicebear.com/7.x/initials/svg?seed=${dbUser?.userName}` ||
                                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp":`https://res.cloudinary.com/dkgzmwdrz/image/upload/v1786346030/avtaar-blabber_qukpkh.png`
                                        
                                    }
                                />
                                <AvatarFallback>{(dbUser?.userName || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </label>

                        <ul tabIndex={0} className="menu dropdown-content bg-white/8 backdrop-blur-2 rounded-box mt-4" role="menu">
                            <li><Link to="/dashboard">Profile <FaRegUserCircle size={18} /></Link></li>
                            <li>
                                {
                                    user ? <button onClick={() => setShowLogoutConfirm(true)}>Logout<FaPowerOff /></button> : <Link to="/login">Login <IoMdLogIn size={20} /></Link>
                                }
                            </li>
                        </ul>
                    </div>
                </div>

            </div >
            <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>You won't be able to revert this!</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
                        <Button variant="default" onClick={handleLogout}>Yes, Logout</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
};

export default Navbar;