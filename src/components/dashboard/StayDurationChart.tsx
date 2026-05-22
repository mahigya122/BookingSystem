import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
    data: {
        name: string;
        value: number;
    } [];
}

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
];

const StayDurationChart = ({data}: Props) => {
        return (
                <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_16px_45px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
                        <div className="flex items-start justify-between">
                            <h2 className="mb-1 text-xl font-black tracking-tight text-slate-900">Stay duration summary</h2>
                            <div className="text-sm text-slate-500">Breakdown by number of nights</div>
                        </div>

                <div className="flex items-center gap-6">
                    <ResponsiveContainer width={280} height={240}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={4}
                            >
                                {data.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="flex flex-col gap-3">
                        {data.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-3">
                                <span className="inline-block h-3 w-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                <div>
                                    <div className="text-sm font-medium text-slate-700">{d.name}</div>
                                    <div className="text-sm text-slate-500">{d.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                </div>
        );
};
export default StayDurationChart;