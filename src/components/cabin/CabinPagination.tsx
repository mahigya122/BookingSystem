interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const CabinPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
}: Props) => {
  return (
    <div className="flex items-center justify-between p-4 border-t bg-white">
      
      {/* LEFT INFO */}
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>

      {/* RIGHT BUTTONS */}
      <div className="flex items-center gap-2">
        
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-lg text-sm transition
            ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          Previous
        </button>

        <button
          onClick={() =>
            setCurrentPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-lg text-sm transition
            ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default CabinPagination;