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
        <div className={`group card p-4 flex items-start justify-between relative overflow-hidden transition-all duration-300 ${containerStyle}`}>
            {/* Playful accent bubble */}
            <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-tr from-sky-400/10 to-indigo-500/10 rounded-full blur-sm group-hover:scale-125 transition-transform" />
            
            <div className="flex flex-col gap-1.5 relative z-10 w-full min-w-0">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-sky-500 transition-colors truncate">{title}</span>
                {isLoading ? (
                    <div className="h-8 w-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800 mt-1" />
                ) : (
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
                )}
            </div>

            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${color} text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-sky-800/50 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
        </div>
    );
};
export default memo(StatsCard);
