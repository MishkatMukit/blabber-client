import { Link } from 'react-router';
import useAllBlabsAPI from '../../API/useAllBlabsAPI';
import BlabCard from '../Card/BlabCard';
import BlabSkeleton from '../Shared/Skeleton/BlabSkeleton';
import { Button } from '../ui/button';

const LiveFeed = () => {
    const { data, isLoading } = useAllBlabsAPI(1, 3);
    const blabs = data?.data || [];

    return (
        <section className="px-4 md:px-6 py-16 md:py-24">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                        Live now
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold">
                        What people are blabbing about
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-base-content/70 max-w-md mx-auto">
                        Real conversations happening right now. Jump in whenever
                        you\u2019re ready.
                    </p>
                </div>

                <div className="space-y-4">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                              <BlabSkeleton key={i} />
                          ))
                        : blabs.map((blab) => (
                              <BlabCard key={blab.id} blab={blab} page={1} />
                          ))}
                </div>

                <div className="text-center mt-10">
                    <Button asChild variant="outline" size="lg">
                        <Link to="/allBlabs">Browse all blabs</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default LiveFeed;
