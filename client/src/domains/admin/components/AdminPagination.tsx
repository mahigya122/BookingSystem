interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  label?: string;
}

const AdminPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  label = "Showing Page",
}: Props) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        {label} {currentPage} <span className="mx-1 text-slate-300 dark:text-slate-700">/</span> {totalPages}
      </p>

      <div className="flex gap-1">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
