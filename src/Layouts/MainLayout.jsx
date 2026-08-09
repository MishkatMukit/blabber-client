import { Outlet } from 'react-router';
import Navbar from '../Components/Shared/Navbar';
import { ToastContainer } from 'react-toastify';
import useAuth from '../Hooks/useAuth';
import Loading from '../Components/Loader/Loading';

const MainLayout = () => {
    const { loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-fixed bg-linear-to-br from-neutral-950 via-slate-800 to-neutral-950">
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
                toastClassName="bg-white/20 border border-white/10 text-white rounded-xl shadow-lg"
                bodyClassName="text-sm font-medium"
                closeButton={false}
            />
            <Navbar></Navbar>
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;