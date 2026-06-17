const stats = [
    { value: "500+", label: "Cabins", icon: "🏡", sub: "Handpicked properties" },
    { value: "15,000+", label: "Guests", icon: "👥", sub: "Happy travellers" },
    { value: "4.9★", label: "Avg Rating", icon: "⭐", sub: "Out of 5 stars" },
    { value: "98%", label: "Satisfaction", icon: "💚", sub: "Would recommend us" },
];

const StatsSection = () => (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ value, label, icon, sub }) => (
            <div
                key={label}
                className="group relative overflow-hidden rounded-3xl bg-white border-2 border-sky-100 p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
                {/* Sky-blue top stripe on hover */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-3xl" />

                <div className="text-3xl mb-3">{icon}</div>
                <div className="text-3xl font-black text-slate-900">{value}</div>
                <div className="mt-1 text-xs font-bold text-sky-400 uppercase tracking-widest">{label}</div>
                <div className="mt-1 text-xs text-slate-400">{sub}</div>
            </div>
        ))}
    </section>
);

export default StatsSection;
