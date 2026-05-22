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
    color="bg-gray-100",
    icon,
}: Props) => {
    return (
        <div className="flex items-center gap-4 rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_16px_45px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
            <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${color} text-slate-900`}>
              {icon}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
              <h2 className="mt-1 text-3xl font-medium tracking-tight text-slate-900">{value}</h2>
            </div>
        </div>
    );
};
export default StatsCard;