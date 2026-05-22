import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

interface Props {
    occupancyRate: number;
}

const OccupancyChart = ({
    occupancyRate
}: Props) => {
    const data = [
        {
            name: "Occupancy",
            value: occupancyRate,
        },
    ];

return (
    <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_16px_45px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
        <h1 className="mb-4 text-xl font-black tracking-tight text-slate-900">Occupancy Rate</h1>

        <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <RadialBar
                    dataKey="value"
                    fill="#4f46e5"
                />
            </RadialBarChart>
        </ResponsiveContainer>

        <p className="mt-4 text-lg font-semibold text-slate-700">
            {occupancyRate}% 
        </p>
    </div>
);
};
export default OccupancyChart;   