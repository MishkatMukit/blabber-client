import { Button } from '../../ui/button';

const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-wrap justify-center gap-2 pt-10 pb-6">
            <Button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                variant="outline"
                size="sm"
            >
                Prev
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                    key={i}
                    onClick={() => onPageChange(i + 1)}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                >
                    {i + 1}
                </Button>
            ))}

            <Button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
