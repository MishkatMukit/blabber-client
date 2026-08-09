import BlabSkeleton from '../../Components/Shared/Skeleton/BlabSkeleton';
import useAllBlabsAPI from '../../API/useAllBlabsAPI';
import BlabCard from '../../Components/Card/BlabCard';
import AddBlabs from '../AddBlabs/AddBlabs';
import { useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { Button } from '../../Components/ui/button';
// import { div } from 'motion/react-client';
const AllBlubs = () => {
    const [page, setPage] = useState(1);
    const limit = 5;
    const { data, isLoading } = useAllBlabsAPI(page, limit)
    const allBlabs = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;
    // console.log(allBlabs);
    const { dbUser } = useAuth()
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
                                <BlabCard key={blab.id} blab={blab} page={page}></BlabCard>
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

                <Button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    variant="outline"
                    size="sm"
                >
                    Prev
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                    <Button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="sm"
                    >
                        {i + 1}
                    </Button>
                ))}

                <Button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    variant="outline"
                    size="sm"
                >
                    Next
                </Button>

            </div>
        </div>
    );
};

export default AllBlubs;