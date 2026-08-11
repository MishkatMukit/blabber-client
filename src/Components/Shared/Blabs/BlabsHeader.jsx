import { Search, Plus } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

const BlabsHeader = ({ query, onQueryChange, canCreate, onCreate }) => {
    return (
        <div className="mb-8">
            <p className="text-xs mt-16 uppercase tracking-[0.2em] text-primary mb-2">
                Explore
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">Blabs</h1>
            <p className="mt-2 text-sm text-base-content/70 max-w-md">
                Quick thoughts, real conversations. Search or jump straight in.
            </p>

            <div className="flex items-center gap-2 mt-6">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search blabs..."
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
                {canCreate && (
                    <Button onClick={onCreate}>
                        <Plus className="size-4" />
                        Create
                    </Button>
                )}
            </div>
        </div>
    );
};

export default BlabsHeader;
