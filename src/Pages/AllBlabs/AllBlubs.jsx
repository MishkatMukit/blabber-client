
import { Suspense } from 'react';
import { allBlabsPromise } from '../../API/allBlabsAPI';
import BlabCard from '../../Components/BlabCard/BlabCard';
import Loading from '../../Components/Loader/Loading';

const AllBlubs = () => {

    return (
        <div className='max-w-3xl mx-auto pt-16'>
            <Suspense fallback={<Loading></Loading>}><BlabCard allBlabsPromise={allBlabsPromise()}></BlabCard></Suspense>    
        </div>
    );
};

export default AllBlubs;