import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useTheme } from "@shared/context/ThemeContext";

interface Props {
    title?: string;
    data: {
        date: string;
        sales: number;
    }[];
}

const SalesChart = ({title = "Revenue Analytics", data}: Props) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const colors = {
        sales: {
            stroke: isDark ? "#e50914" : "#6366f1",
            fill: isDark ? "#e50914" : "#6366f1",
        },
        text: isDark ? "#94a3b8" : "#64748b",
        grid: isDark ? "#262626" : "#f1f5f9",
        tooltipBg: isDark ? "#111111" : "#ffffff",
        tooltipBorder: isDark ? "#2a2a2a" : "#e2e8f0"
    };

    return(
        <div className="card h-full flex flex-col">
            <div className="card-header">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{title}</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year-to-date</span>
            </div>

            <div className="card-body flex-1">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors.sales.fill} stopOpacity={0.1}/>
                                <stop offset="95%" stopColor={colors.sales.fill} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
                        <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{ fill: colors.text, fontSize: 11, fontWeight: 600 }}
                            dy={10}
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            tick={{ fill: colors.text, fontSize: 11, fontWeight: 600 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: colors.tooltipBg, 
                                borderColor: colors.tooltipBorder,
                                borderRadius: "8px",
                                border: "1px solid",
                                fontSize: "12px",
                                fontWeight: "600",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                            }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="sales" 
                            stroke={colors.sales.stroke} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorSales)" 
                            activeDot={{ r: 4, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>    
            </div>
        </div>
    );
};
export default SalesChart;