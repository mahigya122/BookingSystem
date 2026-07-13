import { memo } from "react";
import type { ReactNode } from "react";

interface Props {
    title: string;
    value: string | number;
    color?: string;
    icon?: ReactNode;
    isLoading?: boolean;
}

const getContainerStyles = (color: string) => {
  if (color.includes("bg-sky-50")) return "bg-white border-sky-200/80 dark:bg-slate-900 dark:border-sky-900/45";
  if (color.includes("bg-indigo-50")) return "bg-white border-indigo-200/80 dark:bg-slate-900 dark:border-indigo-900/45";
  if (color.includes("bg-emerald-50")) return "bg-white border-emerald-200/80 dark:bg-slate-900 dark:border-emerald-900/45";
  if (color.includes("bg-amber-50")) return "bg-white border-amber-200/80 dark:bg-slate-900 dark:border-amber-900/45";
  if (color.includes("bg-cyan-50")) return "bg-white border-cyan-200/80 dark:bg-slate-900 dark:border-cyan-900/45";
  if (color.includes("bg-violet-50")) return "bg-white border-violet-200/80 dark:bg-slate-900 dark:border-violet-900/45";
  if (color.includes("bg-rose-50")) return "bg-white border-rose-200/80 dark:bg-slate-900 dark:border-rose-900/45";
  return "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800";
};

const StatsCard = ({
    title,
    value,
    color="bg-sky-50 dark:bg-sky-900/20",
    icon,
    isLoading = false,
}: Props) => {
    const containerStyle = getContainerStyles(color);
    return (
        <div className={`group card p-3 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between relative overflow-hidden transition-all duration-300 h-28 sm:h-auto min-w-0 ${containerStyle}`}>
            {/* Playful accent bubble */}
            <div className="absolute -top-6 -right-6 w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-tr from-sky-400/10 to-indigo-500/10 rounded-full blur-sm group-hover:scale-125 transition-transform pointer-events-none" />
            
            <div className="flex flex-col gap-0.5 sm:gap-1.5 relative z-10 w-full min-w-0 mt-2 sm:mt-0 order-2 sm:order-1">
                <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-[0.2em] text-slate-400 group-hover:text-sky-500 transition-colors truncate">{title}</span>
                {isLoading ? (
                    <div className="h-6 sm:h-8 w-12 sm:w-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 mt-0.5 sm:mt-1" />
                ) : (
                    <span className="text-base sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5 leading-none sm:leading-normal">{value}</span>
                )}
            </div>

            <div className={`relative z-10 flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${color} text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-sky-800/50 shadow-sm group-hover:scale-110 transition-transform duration-300 order-1 sm:order-2`}>
              {icon}
            </div>
        </div>
    );
};
export default memo(StatsCard);
