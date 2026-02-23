import React from 'react';
import Navbar from '../Shared/Navbar';
import Banner from '../Components/HomeComponents/Banner';

const Home = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-950 via-slate-800 to-neutral-950">
            <Navbar></Navbar>
            <Banner></Banner>
        </div>
    );
};

export default Home;