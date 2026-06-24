import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-1 md:gap-2 mt-4 md:mt-8 pb-1 md:pb-2">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-sky-600 hover:border-sky-400 transition-all shadow-sm"
            >
                <ChevronLeft size={16} className="md:size-5" />
            </button>

            <div className="flex items-center gap-1">
                {pages.map((page) => {
                    const isAdjacent = Math.abs(page - currentPage) <= 1;
                    const isFirstOrLast = page === 1 || page === totalPages;
                    
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`
                                w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all duration-300
                                items-center justify-center
                                ${isAdjacent || isFirstOrLast ? "flex" : "hidden md:flex"}
                                ${currentPage === page
                                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105 md:scale-110"
                                    : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-600 hover:border-sky-400"
                                }
                            `}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-sky-600 hover:border-sky-400 transition-all shadow-sm"
            >
                <ChevronRight size={16} className="md:size-5" />
            </button>
        </div>
    );
};

export default Pagination;
