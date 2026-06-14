import type { ReactNode } from "react";

interface Props {
    title: string;
    value: string | number;
    color?: string;
    icon?: ReactNode;
}

const StatsCard = ({
    title,
    value,
    color="bg-sky-50 dark:bg-sky-900/20",
    icon,
}: Props) => {
    return (
        <div className="group card p-8 flex items-start justify-between relative overflow-hidden hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300">
            {/* Soft decorative accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 dark:bg-sky-900/10 rounded-bl-[4rem] -mr-8 -mt-8 group-hover:bg-sky-100 transition-colors" />
            
            <div className="flex flex-col gap-2 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-sky-500 transition-colors">{title}</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
            </div>

            <div className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl ${color} text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-sky-800/50 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
        </div>
    );
};
export default StatsCard;