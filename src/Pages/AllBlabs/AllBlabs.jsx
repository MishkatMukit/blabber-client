import BlabSkeleton from '../../Components/Shared/Skeleton/BlabSkeleton';
import useAllBlabsAPI from '../../API/useAllBlabsAPI';
import BlabCard from '../../Components/Card/BlabCard';
import AddBlabs from '../AddBlabs/AddBlabs';
import { useEffect, useState } from 'react';
import useAuth from '../../Hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { Button } from '../../Components/ui/button';
import { Input } from '../../Components/ui/input';
import { Search, Plus } from 'lucide-react';
// import { div } from 'motion/react-client';
const AllBlubs = () => {
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const limit = 5;
    const { data, isLoading } = useAllBlabsAPI(page, limit, debouncedQuery)
    const allBlabs = data?.data || [];
    const totalPages = data?.meta?.totalPages || 1;
    const { dbUser } = useAuth()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query.trim());
            setPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const hasSearch = debouncedQuery;
    return (
        <div className='max-w-[95%] md:max-w-3xl mx-auto pt-16 px-1 md:px-0 flex flex-col min-h-[calc(100dvh-4rem)]'>
            <Helmet><title>Blabber-Blabs</title></Helmet>
            <div className="flex items-center gap-2 mb-4 mt-4">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search blabs..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                {
                    dbUser && (
                        <Button onClick={() => setCreateOpen(true)}>
                            <Plus className="size-4" />
                            Create
                        </Button>
                    )
                }
            </div>
            <AddBlabs open={createOpen} onOpenChange={setCreateOpen} />
            <div className="divider"><p className='text-base-300 text-center my-6'>Latest Blabs</p></div>
            <div className='flex-1'>
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
                            allBlabs.length === 0 ? (
                                <div className="text-center py-16 opacity-70">
                                    <p className="text-lg">No blabs found</p>
                                    {hasSearch && (
                                        <p className="text-sm mt-1">Try a different keyword or author.</p>
                                    )}                                </div>
                            ) : (
                                allBlabs.map(blab => (
                                    <BlabCard key={blab.id} blab={blab} page={page}></BlabCard>
                                ))
                            )
                        }
                    </div>
                    // <AllBlabCard allBlabs={allBlabs}></AllBlabCard>
                )
            }
            </div>
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