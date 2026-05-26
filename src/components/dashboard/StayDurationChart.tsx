import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../../Context/ThemeContext";

interface Props {
    data: {
        name: string;
        value: number;
    } [];
}

const COLORS_LIGHT = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];
const COLORS_DARK = ["#e50914", "#ff3b30", "#ff5a5f", "#b20710", "#7f0f17"];

const StayDurationChart = ({data}: Props) => {
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const colors = isDark ? COLORS_DARK : COLORS_LIGHT;

    return (
        <div className="card h-full flex flex-col">
            <div className="card-header">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Stay Distribution</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nights per Guest</span>
            </div>

            <div className="card-body flex-1 flex flex-col items-center justify-center">
                <div className="w-full flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {data.map((_, index) => (
                                        <Cell key={index} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: isDark ? "#111111" : "#ffffff", 
                                        borderColor: isDark ? "#2a2a2a" : "#e2e8f0",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col gap-2 w-full md:w-48 shrink-0">
                        {data.map((d, i) => (
                            <div key={d.name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full" style={{ background: colors[i % colors.length] }} />
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{d.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-white">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default StayDurationChart;