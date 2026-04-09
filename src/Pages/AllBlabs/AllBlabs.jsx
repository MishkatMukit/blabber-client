import BlabSkeleton from '../../Components/Shared/Skeleton/BlabSkeleton';
import useAllBlabsAPI from '../../API/useAllBlabsAPI';
import BlabCard from '../../Components/Card/BlabCard';
import AddBlabs from '../AddBlabs/AddBlabs';
import { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import { Helmet } from 'react-helmet-async';
// import { div } from 'motion/react-client';
const AllBlubs = () => {
    const [page, setPage] = useState(1);
    const limit = 5;
    const { data, isLoading } = useAllBlabsAPI(page, limit)
    const allBlabs = data?.data || [];
    const totalPages = data?.totalPages;
    // console.log(allBlabs);
    const { user, dbUser, loading } = useAuth()
    return (
        <div className='max-w-[95%] md:max-w-3xl mx-auto pt-16 px-1 md:px-0'>
            <Helmet><title>Blabber-Blabs</title></Helmet>
            {
                dbUser && <AddBlabs></AddBlabs>
            }
            <div className="divider"><p className='text-base-300 text-center my-6'>Latest Blabs</p></div>
            {
                isLoading ? (
                    <div>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <BlabSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className='max-w-3xl mx-auto'>
                        {
                            allBlabs.map(blab => (
                                <BlabCard key={blab._id} blab={blab} page={page}></BlabCard>
                            ))
                        }
                    </div>
                    // <AllBlabCard allBlabs={allBlabs}></AllBlabCard>
                )
            }
            {/* <Suspense fallback={
                <div>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <BlabSkeleton key={i} />
                    ))}
                </div>
            }><AllBlabCard allBlabsPromise={allBlabsPromise()}></AllBlabCard></Suspense> */}
            <div className="flex flex-wrap justify-center gap-2 pb-10 mt-6">

                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="btn btn-sm bg-white/20 border-none shadow-none"
                >
                    Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`btn  btn-sm ${page === i + 1 ? "btn-primary" : "bg-white/20 border-none shadow-none"}`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="btn btn-sm bg-white/20 border-none shadow-none"
                >
                    Next
                </button>

            </div>
        </div>
    );
};

export default AllBlubs;