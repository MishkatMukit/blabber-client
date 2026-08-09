import React from 'react';
import { LiaCrowSolid } from 'react-icons/lia';
import { RiUserSmileFill } from 'react-icons/ri';
import { Link, NavLink } from 'react-router';
import userIcon from '../assets/user.png'
const Navbar = () => {
    return (
        <div className='max-w-[95%] mx-auto'>
            <div className="navbar bg-white/8 backdrop-blur-2  xl border border-t-0 border-white/20 shadow-lg rounded-sm">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            
                        </ul>
                    </div>
                    <a className="pl-2 text-xl font-levin text-primary">Blabber</a>
                </div>
                <div className="navbar-center hidden lg:flex ">
                    <ul className="menu menu-horizontal px-1">
                        
                    </ul>
                </div>
                <div className="navbar-end">
                    {/* for user icon */}
                    <div>
                        <Link> <img className='size-10 rounded-full' src={userIcon} alt="" /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;