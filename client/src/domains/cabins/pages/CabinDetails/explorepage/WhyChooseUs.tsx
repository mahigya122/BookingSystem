import { CheckCircle2 } from "lucide-react";

const advantages = [
    {
        title: "Expert Guidance",
        desc: "Our local hosts share culture, history, and hidden cabin secrets often missed by visitors.",
    },
    {
        title: "Best Price Guarantee",
        desc: "Find a lower price anywhere? We match it — every time, no questions asked.",
    },
    {
        title: "Safety and Security",
        desc: "Every cabin is verified. Your booking, payment, and stay are fully protected.",
    },
];

const WhyChooseUs = () => (
    <section className="relative overflow-hidden rounded-3xl bg-white border-2 border-sky-50 p-8 md:p-14">
        {/* Dashed circle decoration top-right */}
        <svg className="absolute -top-16 -right-16 w-64 h-64 pointer-events-none" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="90" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6" opacity="0.2" />
        </svg>
        {/* Palm bottom-right */}
        <svg className="absolute bottom-0 right-6 w-20 h-28 pointer-events-none" viewBox="0 0 100 140" fill="none">
            <rect x="46" y="60" width="8" height="80" rx="4" fill="#4ade80" opacity="0.35" />
            <ellipse cx="50" cy="55" rx="30" ry="18" fill="#22c55e" opacity="0.3" transform="rotate(-20 50 55)" />
            <ellipse cx="50" cy="45" rx="22" ry="12" fill="#4ade80" opacity="0.35" transform="rotate(-35 50 45)" />
        </svg>

        <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
            {/* Left — text */}
            <div className="space-y-6">
                {/* Decorative "Why Choose Us" label with icon */}
                <div className="flex items-center gap-2">
                    <svg className="w-7 h-7 text-slate-400" viewBox="0 0 40 40" fill="currentColor" opacity="0.5">
                        <path d="M20 2L24 14H37L27 22L31 34L20 26L9 34L13 22L3 14H16Z" />
                    </svg>
                    <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        Why Choose Us
                    </p>
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight">What are our Advantages</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                    We've obsessed over every detail so your cabin stay is seamless from first click to final morning coffee.
                </p>

                <div className="space-y-5">
                    {advantages.map(({ title, desc }) => (
                        <div key={title} className="flex gap-3 items-start">
                            <CheckCircle2 className="h-5 w-5 text-sky-400 mt-0.5 shrink-0" fill="#e0f2fe" />
                            <div>
                                <p className="font-bold text-slate-800 text-sm">{title}</p>
                                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right — overlapping photos (like reference image 2) */}
            <div className="relative h-80 hidden md:block">
                {/* Passport emoji floating */}
                <div className="absolute -top-4 left-16 text-5xl z-20 drop-shadow-lg select-none pointer-events-none">🛂</div>

                {/* Main background image */}
                <div className="absolute right-0 top-0 w-72 h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                        src="https://images.unsplash.com/photo-1551524559-8af4e6624178?w=500&q=80"
                        alt="Snowy cabin"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Overlapping front image */}
                <div className="absolute left-0 bottom-0 w-52 h-60 rounded-3xl overflow-hidden shadow-xl border-4 border-white z-10">
                    <img
                        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80"
                        alt="Guests enjoying cabin"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    </section>
);

export default WhyChooseUs;