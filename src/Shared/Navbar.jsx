import React from 'react';
import { LiaCrowSolid } from 'react-icons/lia';
import { Link, NavLink } from 'react-router';

const Navbar = () => {
    return (
        <div className='max-w-[95%] mx-auto'>
            <div className="navbar bg-white/8 backdrop-blur-2  xl border border-white/20 shadow-lg rounded-sm">
                <div className="flex-1">
                    <a className="px-3 font-levin text-2xl flex items-center"><LiaCrowSolid size={28} className='inline' />Blabber</a>
                </div>
                <div className="flex gap-2">
                    <NavLink className="flex items-center btn btn-ghost">Blabs</NavLink>
                    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;