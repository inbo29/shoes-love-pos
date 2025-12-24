import React from 'react';

interface PosPaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const PosPagination: React.FC<PosPaginationProps> = ({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalItems === 0) return null;

    return (
        <div className="bg-white p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">

            <div className="flex items-center gap-1.5">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <span className="material-icons-round text-base">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    // For simplicity, showing all pages if total pages are few, or a windowed version
                    // Here we show all just for the prototype, but we could add ellipsis logic
                    return (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) ? (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition-all
                                ${currentPage === page
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 border-primary'
                                    : 'border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
                                }
                            `}
                        >
                            {page}
                        </button>
                    ) : (
                        page === currentPage - 2 || page === currentPage + 2 ? (
                            <span key={page} className="text-gray-300 px-1">...</span>
                        ) : null
                    );
                })}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                >
                    <span className="material-icons-round text-base">chevron_right</span>
                </button>
            </div>
        </div>
    );
};

export default PosPagination;
