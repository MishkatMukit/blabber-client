import AllBlabCard from '../../Components/BlabCard/AllBlabCard';
import Loading from '../../Components/Loader/Loading';
import BlabSkeleton from '../../Components/Shared/Skeleton/BlabSkeleton';
import useAllBlabsAPI from '../../API/useAllBlabsAPI';
// import { div } from 'motion/react-client';
const AllBlubs = () => {
    const {data: allBlabs=[], isLoading}= useAllBlabsAPI()
    return (
        <div className='max-w-[95%] mx-auto pt-16'>

            <div className="divider"><p className='text-base-300 text-center my-6'>Latest Blabs</p></div>
            {

            }
            {
                isLoading? (
                    <div>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <BlabSkeleton key={i} />
                    ))}
                </div>
                ):(
                    <AllBlabCard allBlabs={allBlabs}></AllBlabCard>
                )
            }
            {/* <Suspense fallback={
                <div>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <BlabSkeleton key={i} />
                    ))}
                </div>
            }><AllBlabCard allBlabsPromise={allBlabsPromise()}></AllBlabCard></Suspense> */}
        </div>
    );
};

export default AllBlubs;