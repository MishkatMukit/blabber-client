import { Outlet } from 'react-router';
import Navbar from '../Components/Shared/Navbar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-fixed bg-linear-to-br from-neutral-950 via-slate-800 to-neutral-950">
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;