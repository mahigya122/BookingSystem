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
        <div className="flex items-center justify-center gap-2 mt-12 pb-8">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-sky-600 hover:border-sky-400 transition-all shadow-sm"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            w-10 h-10 rounded-xl text-xs font-black transition-all duration-300
                            ${currentPage === page
                                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-110"
                                : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-600 hover:border-sky-400"
                            }
                        `}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-sky-600 hover:border-sky-400 transition-all shadow-sm"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
