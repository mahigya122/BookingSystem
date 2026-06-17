import { useReviews } from "@shared/hooks/useReviews";
import { usePagination } from "@shared/hooks/usePagination";
import { Star, Trash2, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

const Reviews = () => {
  const { reviews = [], isLoading, removeReview, moderateReview } = useReviews();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(reviews, 6);

  if (isLoading) return <p>Loading Reviews...</p>;

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Guest Reviews</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Moderate and manage guest feedback.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {paginatedData.map((review) => (
          <div key={review.id} className="card p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold">
                    {review.guest?.full_name?.charAt(0) || "G"}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white leading-none">{review.guest?.full_name || "Guest"}</p>
                    <p className="text-[10px] font-bold text-sky-500 uppercase mt-1">{review.cabin?.name || "Unknown Cabin"}</p>
                    <div className="flex mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {new Date(review.created_at!).toLocaleDateString()}
                  </span>
                  {review.is_moderated ? (
                    review.is_approved ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-450 border border-rose-100 dark:border-rose-900/50">
                        Rejected
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50">
                      Pending
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-650 dark:text-slate-350 italic">"{review.comment}"</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={() => moderateReview({ id: review.id, is_moderated: true, is_approved: true })}
                  className={`p-2 rounded-lg border transition-all ${
                    review.is_moderated && review.is_approved
                      ? "text-emerald-600 border-emerald-250 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900"
                      : "text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-500 hover:border-emerald-100"
                  }`}
                  title="Approve Review"
                >
                  <CheckCircle size={18} />
                </button>
                <button 
                  onClick={() => moderateReview({ id: review.id, is_moderated: true, is_approved: false })}
                  className={`p-2 rounded-lg border transition-all ${
                    review.is_moderated && review.is_approved === false
                      ? "text-rose-600 border-rose-250 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900"
                      : "text-slate-400 border-slate-200 dark:border-slate-800 hover:text-rose-500 hover:border-rose-100"
                  }`}
                  title="Reject Review"
                >
                  <XCircle size={18} />
                </button>
              </div>
              <button 
                onClick={() => removeReview(review.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                title="Delete Review"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="card px-8 py-6 flex items-center justify-between shadow-premium">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Showing Page {currentPage} <span className="mx-1 text-slate-300 dark:text-slate-700">/</span> {totalPages}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
