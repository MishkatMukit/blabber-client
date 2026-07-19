import React from 'react';
import Home from '../Pages/Home';
import Navbar from '../Shared/Navbar';
import { Outlet } from 'react-router';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-950 via-slate-800 to-neutral-950">
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;