import { Suspense } from 'react';
import { allBlabsPromise } from '../../API/allBlabsAPI';
import BlabCard from '../../Components/BlabCard/BlabCard';
import Loading from '../../Components/Loader/Loading';
const AllBlubs = () => {
    
    return (
        <div className='max-w-[90%] mx-auto pt-16'>
            
            <div className="divider"><p className='text-base-300 text-center my-6'>Latest Blabs</p></div>
            <Suspense fallback={<Loading></Loading>}><BlabCard allBlabsPromise={allBlabsPromise()}></BlabCard></Suspense>    
        </div>
    );
};

export default AllBlubs;