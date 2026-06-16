import { Mountain } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

const footerLinks = {
    Explore: ["Cabins", "Locations", "Activities", "Offers"],
    Support: ["Help Center", "FAQs", "Contact"],
    Company: ["About", "Careers", "Blog"],
    Legal: ["Privacy", "Terms", "Cookies"],
};
const ExploreFooter = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsSearching } = useCabinFiltersContext();
    const [qrCode, setQrCode] = useState("");

    // Generate a real QR code for Google Review on mount
    useEffect(() => {
        // Placeholder for real Google Review link
        const reviewUrl = "https://search.google.com/local/writereview?placeid=CABINHUB_PLACE_ID";
        QRCode.toDataURL(reviewUrl, {
            margin: 1,
            width: 200,
            color: {
                dark: "#000000", 
                light: "#ffffff"
            }
        }).then(setQrCode).catch((err: Error) => console.error(err));
    }, []);

    const handleLinkClick = (cat: string, lnk: string) => {
        const isHome = location.pathname === "/";
        const slug = lnk.toLowerCase().replace(/ /g, "-");

        if (cat === "Explore") {
            if (lnk === "Cabins") {
                setIsSearching(true);
                if (!isHome) navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            const sectionIdMap: Record<string, string> = {
                "Locations": "explore-locations",
                "Activities": "activities-section",
                "Offers": "special-offers"
            };

            const id = sectionIdMap[lnk];
            if (id) {
                if (!isHome) {
                    navigate("/", { state: { scrollTo: id } });
                } else {
                    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }
            }
        } else {
            navigate(`/info/${slug}`);
        }
    };

    return (
        <footer className="bg-slate-950 text-white pt-24 pb-12 overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
                <div className="grid gap-16 md:grid-cols-5 lg:grid-cols-6 mb-20">
                    {/* Brand & Social Proof */}
                    <div className="md:col-span-2 space-y-10">
                        <div className="space-y-6">
                            <div
                                className="flex items-center gap-4 cursor-pointer group w-fit"
                                onClick={() => navigate("/")}
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 shadow-xl shadow-sky-500/20 group-hover:scale-110 transition-transform duration-300">
                                    <Mountain className="h-6 w-6 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-3xl font-black tracking-tight">Cabin<span className="text-sky-500">Hub</span></span>
                            </div>
                            <p className="text-lg leading-relaxed text-slate-400 max-w-sm font-medium">
                                The home for unforgettable nature escapes — handpicked cabins, seamless booking, and memories that last.
                            </p>
                            <div className="flex gap-4">
                                {["𝕏", "📸", "f", "in"].map((s, i) => (
                                    <div
                                        key={i}
                                        className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg text-slate-400 hover:bg-sky-500 hover:text-white hover:-translate-y-1 hover:border-sky-500 transition-all duration-300 cursor-pointer"
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QR Review Section (Minimalist) */}
                        <div className="flex items-center gap-6 group cursor-default">
                            <div className="relative shrink-0">
                                <div className="absolute -inset-2 bg-sky-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative bg-white p-2 rounded-xl shadow-2xl">
                                    {qrCode ? (
                                        <img src={qrCode} alt="Google Review" className="w-16 h-16 md:w-20 md:h-20" />
                                    ) : (
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 animate-pulse rounded-lg" />
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-white tracking-tight uppercase">Review us on <span className="text-sky-400">Google</span></p>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed max-w-[140px]">
                                    Your feedback helps us grow. <br /> Scan to share your stay!
                                </p>
                            </div>
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([cat, links]) => (
                        <div key={cat} className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{cat}</h4>
                            <ul className="space-y-4">
                                {links.map((lnk) => (
                                    <li key={lnk}>
                                        <button
                                            onClick={() => handleLinkClick(cat, lnk)}
                                            className="text-base text-slate-400 hover:text-sky-400 font-medium transition-colors duration-300 block text-left w-full"
                                        >
                                            {lnk}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p className="text-sm text-slate-500 font-medium">© 2026 CabinHub. All rights reserved.</p>
                        <div className="flex gap-6">
                            {["Privacy Policy", "Terms of Service"].map(l => (
                                <button
                                    key={l}
                                    onClick={() => handleLinkClick("Legal", l.includes("Privacy") ? "Privacy" : "Terms")}
                                    className="text-sm text-slate-600 hover:text-slate-400 transition-colors"
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                    <p className="text-sm text-slate-700 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Made for adventurers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default ExploreFooter;