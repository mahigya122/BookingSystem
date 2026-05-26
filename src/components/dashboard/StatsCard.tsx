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
    color="bg-primary-50 dark:bg-primary-950/50",
    icon,
}: Props) => {
    return (
                <div className="card card-accent p-6 flex items-start justify-between relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-(--app-primary) via-(--app-secondary) to-transparent opacity-70" />
                        <div className="flex flex-col gap-1 relative z-10">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{title}</span>
                            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</span>
            </div>

                        <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl ${color} text-primary-600 dark:text-primary-400 border border-primary-100/50 dark:border-primary-800/50 shadow-sm`}>
              {icon}
            </div>
        </div>
    );
};
export default StatsCard;