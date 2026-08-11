import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useAllBlabsAPI from '../../API/useAllBlabsAPI';
import useAuth from '../../Hooks/useAuth';
import AddBlabs from '../AddBlabs/AddBlabs';
import BlabsHeader from '../../Components/Shared/Blabs/BlabsHeader';
import BlabsFeed from '../../Components/Shared/Blabs/BlabsFeed';
import Pagination from '../../Components/Shared/Blabs/Pagination';

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
            <BlabsHeader
                query={query}
                onQueryChange={setQuery}
                canCreate={!!dbUser}
                onCreate={() => setCreateOpen(true)}
            />
            <AddBlabs open={createOpen} onOpenChange={setCreateOpen} />

            <div className="divider"><p className='text-base-300 text-center my-6'>Latest Blabs</p></div>

            <div className='flex-1'>
                <BlabsFeed
                    blabs={allBlabs}
                    isLoading={isLoading}
                    hasSearch={hasSearch}
                    page={page}
                />
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default AllBlubs;
