import { useState } from "react";
import { Mail } from "lucide-react";

const NewsletterCTA = () => {
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    const submit = () => {
        if (email.trim()) { setDone(true); setEmail(""); }
    };

    return (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 to-cyan-500 px-10 py-16 text-white shadow-xl">
            {/* Decorative dots */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:22px_22px]" />
            {/* Dashed circle */}
            <svg className="absolute -bottom-16 -right-16 w-72 h-72 pointer-events-none" viewBox="0 0 200 200" fill="none">
                <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2" strokeDasharray="8 6" opacity="0.2" />
            </svg>
            {/* Palm */}
            <svg className="absolute bottom-0 left-10 w-16 h-24 pointer-events-none" viewBox="0 0 100 140" fill="none">
                <rect x="46" y="60" width="8" height="80" rx="4" fill="white" opacity="0.15" />
                <ellipse cx="50" cy="55" rx="30" ry="18" fill="white" opacity="0.12" transform="rotate(-20 50 55)" />
                <ellipse cx="50" cy="45" rx="22" ry="12" fill="white" opacity="0.15" transform="rotate(-35 50 45)" />
            </svg>

            <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-xl mx-auto">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 border border-white/30 backdrop-blur-sm">
                    <Mail className="h-7 w-7 text-white" />
                </div>

                <div className="space-y-2">
                    <p className="text-white/80 text-lg font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        Stay in the Loop
                    </p>
                    <h2 className="text-4xl font-black">Get Exclusive Cabin Deals</h2>
                    <p className="text-white/70 text-sm">
                        Join 12,000+ subscribers getting the best cabin deals, travel tips, and hidden gems delivered weekly.
                    </p>
                </div>

                {done ? (
                    <div className="rounded-2xl bg-white/20 border border-white/30 px-8 py-4 text-white font-semibold">
                        🎉 You're in! Check your inbox for a welcome surprise.
                    </div>
                ) : (
                    <div className="flex w-full max-w-sm flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submit()}
                            placeholder="Enter your email address"
                            className="flex-1 rounded-full bg-white/20 border border-white/30 px-5 py-3 text-sm text-white placeholder-white/50 outline-none focus:bg-white/30 transition-all duration-200"
                        />
                        <button
                            onClick={submit}
                            className="shrink-0 rounded-full bg-white text-sky-600 px-6 py-3 text-sm font-bold shadow-md hover:bg-sky-50 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Subscribe
                        </button>
                    </div>
                )}

                <p className="text-xs text-white/40">No spam, ever. Unsubscribe anytime.</p>
            </div>
        </section>
    );
};

export default NewsletterCTA;