import { useEffect, useRef, useState } from "react";
import { X, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { createPortal } from "react-dom";

const OFFERS = [
    {
        tag: "Exclusive Offer",
        badge: "Flash Deal",
        headline: ["Up to ", "30% off", " your first cabin stay"],
        sub: "Escape the city — handpicked mountain & lakeside cabins at unbeatable prices. Only available today.",
        perks: ["Free cancellation", "50+ destinations", "Instant confirmation"],
        cta: "Book Now",
    },
    {
        tag: "Weekend Special",
        badge: "Hot Deal",
        headline: ["Cabins from ", "$49/night", " this weekend"],
        sub: "Limited slots. Premium stays at prices you won't find anywhere else. Book in the next few minutes.",
        perks: ["No hidden fees", "Pet-friendly options", "Best price guarantee"],
        cta: "Grab the Deal",
    },
    {
        tag: "Just Listed",
        badge: "New Arrivals",
        headline: ["Fresh lakeside ", "& mountain", " cabins added"],
        sub: "Be the first to book our newest handpicked stays before they fill up this season.",
        perks: ["Early bird pricing", "Verified properties", "24/7 support"],
        cta: "Explore Now",
    },
];

const AUTO_DISMISS_MS = 8000;
const SESSION_KEY = "promoBannerShown";   // sessionStorage: resets on refresh/new tab
const LOGO_CLICK_CHANCE = 0.25;           // 25% chance on logo click

interface PromoBannerProps {
    onCtaClick?: () => void;
    triggerKey?: string | number;
    /** Pass "logo" to trigger via logo click (subject to random chance) */
    trigger?: "auto" | "logo" | "login";
}

export const PromoBanner = ({ onCtaClick, triggerKey, trigger = "auto" }: PromoBannerProps) => {
    const [phase, setPhase] = useState<"hidden" | "entering" | "visible" | "leaving">("hidden");
    const [secs, setSecs] = useState(8);
    const [offer] = useState(() => OFFERS[Math.floor(Math.random() * OFFERS.length)]);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const dismiss = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (countRef.current) clearInterval(countRef.current);
        setPhase("leaving");
        setTimeout(() => setPhase("hidden"), 400);
    };

    const launch = () => {
        setSecs(8);
        setPhase("entering");
        setTimeout(() => setPhase("visible"), 60);

        let s = 8;
        countRef.current = setInterval(() => {
            s--;
            setSecs(s);
            if (s <= 0) clearInterval(countRef.current!);
        }, 1000);

        timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    };

    useEffect(() => {
        // "auto" trigger = first visit or page refresh (sessionStorage resets on both)
        if (trigger === "auto") {
            const alreadyShown = sessionStorage.getItem(SESSION_KEY);
            if (alreadyShown) return;
            sessionStorage.setItem(SESSION_KEY, "1");
            const t = setTimeout(launch, 800);
            return () => {
                clearTimeout(t);
                if (timerRef.current) clearTimeout(timerRef.current);
                if (countRef.current) clearInterval(countRef.current);
            };
        }

        // "login" trigger = always show after login (caller controls when triggerKey changes)
        if (trigger === "login") {
            if (!triggerKey) return;
            const t = setTimeout(launch, 800);
            return () => {
                clearTimeout(t);
                if (timerRef.current) clearTimeout(timerRef.current);
                if (countRef.current) clearInterval(countRef.current);
            };
        }

        // "logo" trigger = 25% random chance
        if (trigger === "logo") {
            if (!triggerKey) return;
            if (Math.random() > LOGO_CLICK_CHANCE) return; // 75% of the time, do nothing
            const t = setTimeout(launch, 150);
            return () => {
                clearTimeout(t);
                if (timerRef.current) clearTimeout(timerRef.current);
                if (countRef.current) clearInterval(countRef.current);
            };
        }
    }, [triggerKey, trigger]);

    if (phase === "hidden") return null;

    const isVisible = phase === "visible";
    const isLeaving = phase === "leaving";

    return createPortal(
        <>
            <style>{`
        @keyframes promoCountdown {
          from { width: 100%; }
          to   { width: 0%; }
        }
        @keyframes badgePop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .promo-badge-anim { animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.35s both; }
        .promo-perk-anim  { animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) var(--delay, 0.5s) both; }
      `}</style>

            {/* Backdrop */}
            <div
                onClick={dismiss}
                style={{
                    position: "fixed", inset: 0, zIndex: 999,
                    background: "rgba(2, 8, 23, 0.72)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    transition: "opacity 0.4s ease",
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Modal */}
            <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", pointerEvents: "none" }}>
                <div
                    style={{
                        width: "100%", maxWidth: "540px",
                        borderRadius: "24px", overflow: "hidden",
                        background: "#0c1a2e",
                        boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
                        pointerEvents: "auto",
                        transition: "transform 0.5s cubic-bezier(0.34,1.4,0.64,1), opacity 0.4s ease",
                        transform: isVisible ? "scale(1) translateY(0)" : isLeaving ? "scale(0.93) translateY(-16px)" : "scale(0.88) translateY(28px)",
                        opacity: isVisible ? 1 : 0,
                    }}
                >
                    {/* Image band */}
                    <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#071628" }}>
                        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 540 200" preserveAspectRatio="xMidYMid slice">
                            <defs>
                                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
                                    <stop offset="100%" stopColor="#1e3a5f" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                            <rect width="540" height="200" fill="url(#sky)" />
                            {[55, 115, 195, 270, 345, 430, 495, 155, 310, 470].map((x, i) => (
                                <circle key={i} cx={x} cy={[28, 16, 22, 10, 26, 14, 30, 38, 42, 46][i]} r={i % 2 === 0 ? 1.5 : 1} fill="#fff" opacity={0.5 + (i % 3) * 0.2} />
                            ))}
                            <circle cx="450" cy="36" r="22" fill="#0c4a6e" opacity="0.5" />
                            <circle cx="450" cy="36" r="14" fill="#e0f2fe" opacity="0.92" />
                            <polygon points="0,200 95,78 190,200" fill="#0a2540" />
                            <polygon points="75,200 190,58 305,200" fill="#0d3560" />
                            <polygon points="190,200 310,88 430,200" fill="#0a2540" />
                            <polygon points="305,200 420,68 540,200" fill="#091d35" />
                            <rect x="0" y="168" width="540" height="32" fill="#071628" />
                            <rect x="18" y="160" width="10" height="40" rx="2" fill="#14532d" opacity="0.9" />
                            <ellipse cx="23" cy="155" rx="12" ry="10" fill="#166534" opacity="0.85" />
                            <rect x="505" y="165" width="8" height="35" rx="2" fill="#14532d" opacity="0.9" />
                            <ellipse cx="509" cy="160" rx="10" ry="8" fill="#166534" opacity="0.85" />
                            <rect x="480" y="168" width="6" height="32" rx="2" fill="#14532d" opacity="0.8" />
                            <ellipse cx="483" cy="164" rx="8" ry="7" fill="#15803d" opacity="0.8" />
                            <rect x="228" y="148" width="84" height="52" fill="#0a1929" />
                            <polygon points="218,150 270,118 322,150" fill="#0f2a45" />
                            <rect x="248" y="162" width="16" height="38" fill="#071220" />
                            <rect x="276" y="158" width="18" height="16" fill="#0ea5e9" opacity="0.15" />
                            <path d="M0 180 Q135 170 270 176 Q405 182 540 174 L540 200 L0 200 Z" fill="#071628" opacity="0.7" />
                        </svg>

                        <span className="promo-badge-anim" style={{ position: "absolute", top: 16, left: 20, zIndex: 5, background: "#f59e0b", color: "#78350f", fontSize: "10px", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: "100px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                            <Zap size={10} />{offer.badge}
                        </span>

                        <button onClick={dismiss} aria-label="Close" style={{ position: "absolute", top: 14, right: 16, zIndex: 5, width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.4)", border: "none", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={13} />
                        </button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "28px 28px 24px" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ display: "inline-block", width: 20, height: 2, background: "#38bdf8", borderRadius: 1 }} />
                            {offer.tag}
                        </p>

                        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#f0f9ff", lineHeight: 1.25, marginBottom: 8 }}>
                            {offer.headline[0]}
                            <span style={{ color: "#38bdf8" }}>{offer.headline[1]}</span>
                            {offer.headline[2]}
                        </h2>

                        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.65, marginBottom: 20 }}>{offer.sub}</p>

                        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
                            {offer.perks.map((p, i) => (
                                <div key={p} className="promo-perk-anim" style={{ "--delay": `${0.45 + i * 0.08}s`, display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cbd5e1", fontWeight: 500 } as React.CSSProperties}>
                                    <CheckCircle2 size={13} color="#34d399" />{p}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <button
                                onClick={() => { dismiss(); onCtaClick?.(); }}
                                style={{ flex: 1, background: "#0ea5e9", color: "#fff", border: "none", borderRadius: 12, padding: "14px 20px", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.2s" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "#0284c7")}
                                onMouseLeave={e => (e.currentTarget.style.background = "#0ea5e9")}
                            >
                                <ArrowRight size={16} />{offer.cta}
                            </button>
                            <button onClick={dismiss} style={{ fontSize: 12, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: "8px 4px", whiteSpace: "nowrap" }}>
                                Maybe later
                            </button>
                        </div>

                        <div style={{ marginTop: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                <span style={{ fontSize: 11, color: "#475569" }}>Offer expires in</span>
                                <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>{secs}s</span>
                            </div>
                            <div style={{ height: 3, background: "#1e3a5f", borderRadius: 2, overflow: "hidden" }}>
                                <div key={triggerKey} style={{ height: "100%", background: "#0ea5e9", borderRadius: 2, animation: `promoCountdown ${AUTO_DISMISS_MS}ms linear forwards` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};