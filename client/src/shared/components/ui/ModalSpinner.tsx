import { Loader2 } from "lucide-react";

export const ModalSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800/80 flex flex-col items-center gap-3 animate-zoom-in">
        <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Loading Content...
        </span>
      </div>
    </div>
  );
};

export default ModalSpinner;
