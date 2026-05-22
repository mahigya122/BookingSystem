import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Props {
    title?: string;
    data: {
        date: string;
        sales: number;
    }[];
}

const SalesChart = ({title = "Sales Overview", data}: Props) => {
    return(
        <div className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_16px_45px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
            <h2 className="mb-4 text-xl font-black tracking-tight text-slate-900">{title}</h2>


        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />


            <Area 
            type="monotone" 
            dataKey="sales" 
            stroke="#8884d8" 
            fill="#8884d8" 
            />
            </AreaChart>
        </ResponsiveContainer>    
        </div>
    );
};
export default SalesChart;