import BlabCard from '../../Card/BlabCard';
import BlabSkeleton from '../Skeleton/BlabSkeleton';

const BlabsFeed = ({ blabs, isLoading, hasSearch, page = 1 }) => {
    if (isLoading) {
        return (
            <div>
                {Array.from({ length: 4 }).map((_, i) => (
                    <BlabSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (blabs.length === 0) {
        return (
            <div className="text-center py-20 border-t border-white/10">
                <p className="text-lg">No blabs found</p>
                {hasSearch && (
                    <p className="text-sm mt-1 text-base-content/70">
                        Try a different keyword or author.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {blabs.map((blab) => (
                <BlabCard key={blab.id} blab={blab} page={page} />
            ))}
        </div>
    );
};

export default BlabsFeed;
