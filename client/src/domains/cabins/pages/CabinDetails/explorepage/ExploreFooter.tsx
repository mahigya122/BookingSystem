import { Mountain } from "lucide-react";

const footerLinks = {
    Explore: ["Cabins", "Locations", "Activities", "Offers"],
    Support: ["Help Center", "FAQs", "Contact"],
    Company: ["About", "Careers", "Blog"],
    Legal: ["Privacy", "Terms", "Cookies"],
};

const ExploreFooter = () => (
    <footer className="rounded-3xl bg-slate-900 text-white overflow-hidden">
        <div className="px-8 pt-12 pb-6 md:px-12">
            <div className="grid gap-10 md:grid-cols-5 lg:grid-cols-6">
                {/* Brand */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400">
                            <Mountain className="h-5 w-5 text-white" strokeWidth={2} />
                        </div>
                        <span className="text-xl font-black tracking-tight">CabinHub</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
                        The home for unforgettable nature escapes — handpicked cabins, seamless booking, and memories that last.
                    </p>
                    <div className="flex gap-3">
                        {["𝕏", "📸", "f"].map((s, i) => (
                            <div
                                key={i}
                                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm text-slate-400 hover:bg-sky-400 hover:text-white transition-all duration-200 cursor-pointer"
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>

                {Object.entries(footerLinks).map(([cat, links]) => (
                    <div key={cat} className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">{cat}</h4>
                        <ul className="space-y-2">
                            {links.map((lnk) => (
                                <li key={lnk}>
                                    <a href="#" className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200">
                                        {lnk}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500">© 2026 CabinHub. All rights reserved.</p>
                <p className="text-xs text-slate-600">Made with 🌲 for adventurers everywhere.</p>
            </div>
        </div>
    </footer>
);

export default ExploreFooter;