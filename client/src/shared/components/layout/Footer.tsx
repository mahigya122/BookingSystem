import { Mountain, Star } from "lucide-react";
import {
    FaXTwitter,
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn
} from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useCabinFiltersContext } from "../../../domains/cabins/contexts/CabinFiltersContext";
import { scrollToTop } from "../../hooks/useScrollToTop";

const footerLinks = {
    Explore: ["Cabins", "Locations", "Activities", "Offers"],
    Support: ["Help Center", "FAQs", "Contact"],
    Company: ["About", "Careers", "Blog"],
    Legal: ["Privacy", "Terms", "Cookies"],
};

const socialLinks = [
    { icon: FaXTwitter, name: "Twitter" },
    { icon: FaInstagram, name: "Instagram" },
    { icon: FaFacebookF, name: "Facebook" },
    { icon: FaLinkedinIn, name: "Linkedin" },
];

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setIsSearching, isSearching, clearFilters } = useCabinFiltersContext();
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
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

        // Always provide feedback by scrolling to top if it's not a section scroll
        const sectionIdMap: Record<string, string> = {
            "Cabins": "popular-cabins",
            "Locations": "explore-locations",
            "Activities": "activities-section",
            "Offers": "special-offers"
        };

        if (cat === "Explore") {
            const id = sectionIdMap[lnk];
            if (id) {
                // If we are searching (showing search results), we clear it to show sections
                if (isSearching) {
                    setIsSearching(false);
                }

                if (!isHome) {
                    navigate("/", { state: { scrollTo: id } });
                } else {
                    // Small delay to allow isSearching state to propagate if it was true
                    setTimeout(() => {
                        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                    }, isSearching ? 100 : 0);
                }
                return;
            }
        }
 else {
            const targetPath = `/info/${slug}`;
            if (location.pathname === targetPath) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                navigate(targetPath);
            }
        }
    };

    return (
        <footer className="bg-slate-950 text-white pt-16 pb-12 overflow-hidden border-t border-white/5 shrink-0">
            <div className="px-4 md:px-8">
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-12 md:gap-16 mb-20">
                    {/* Brand & Social Proof */}
                    <div className="col-span-2 md:col-span-2 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 w-fit">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 shadow-xl shadow-sky-500/20 transition-transform duration-300">
                                    <Mountain className="h-6 w-6 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-3xl font-black tracking-tight">Cabin<span className="text-sky-500">Hub</span></span>
                            </div>
                            <p className="text-lg leading-relaxed text-slate-400 max-w-sm font-medium">
                                The home for unforgettable nature escapes — handpicked cabins, seamless booking, and memories that last.
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map((s, i) => (
                                    <div
                                        key={i}
                                        className="h-8 w-8 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-all duration-300 cursor-pointer"
                                    >
                                        <s.icon size={16} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* QR Review Section */}
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

                                <div className="flex gap-0.5 py-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

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

export default Footer;
