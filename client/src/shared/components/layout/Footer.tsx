import { Mountain, Star } from "lucide-react";
import {
  FaXTwitter,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { LEGACY_INFO_SLUG_MAP } from "../../../app/path";

const footerLinks = {
  Support: ["Help Center", "FAQs", "Contact"],
  Company: ["About", "Careers", "Blog"],
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
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const reviewUrl =
      "https://search.google.com/local/writereview?placeid=CABINHUB_PLACE_ID";
    QRCode.toDataURL(reviewUrl, {
      margin: 1,
      width: 200,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then(setQrCode)
      .catch((err: Error) => console.error(err));
  }, []);

  const handleLinkClick = (lnk: string) => {
    const slug = lnk.toLowerCase().replace(/ /g, "-");
    const targetPath = LEGACY_INFO_SLUG_MAP[slug] || `/info/${slug}`;

    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(targetPath);
    }
  };

  return (
    <footer
      className="text-white pt-10 pb-6 overflow-hidden border-t border-white/5 shrink-0"
      style={{
        background: "linear-gradient(180deg, #020617 0%, #0b1329 100%)",
      }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10 md:gap-12 lg:gap-16 mb-8">
          {/* Brand & Social Proof */}
          <div className="col-span-2 md:col-span-2 space-y-5">
            <div className="space-y-6">
              <div
                onClick={() => {
                  navigate("/");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 cursor-pointer group w-fit text-white hover:text-sky-400 transition-colors duration-300"
              >
                <Mountain className="h-5 w-5 text-sky-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-lg font-black tracking-tight leading-none">
                  CabinHub
                </span>
              </div>
              <p className="text-xs md:text-sm lg:text-base leading-relaxed text-slate-400 max-w-sm font-medium">
                The home for unforgettable nature escapes — handpicked cabins,
                seamless booking, and memories that last.
              </p>

              {/* Flat Inline Review Info (No Cards) */}
              <div className="flex items-center gap-3 pt-1">
                <div className="relative shrink-0 select-none">
                  {qrCode ? (
                    <img
                      src={qrCode}
                      alt="Google Review"
                      className=" h-12 w-12 sm:w-16 sm:h-16 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 cursor-default"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-900/50 animate-pulse rounded-lg" />
                  )}
                </div>
                <div className="text-left space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] md:text-[14px] lg:text-[16px] font-black text-slate-300 tracking-wider uppercase">
                      Scan to Review
                    </span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] md:text-[10px] lg:text-[12px] text-slate-500 font-semibold leading-normal">
                    Share your cabin experience on Google.
                  </p>
                </div>
              </div>

              <div className="flex gap-4.5 pt-1">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={s.name}
                    className="text-slate-400 hover:text-sky-400 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column Links */}
          {Object.entries(footerLinks).map(([cat, links]) => (
            <div key={cat} className="space-y-4 col-span-1">
              <h4 className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-[0.35em] text-slate-500">
                {cat}
              </h4>
              <ul className="space-y-2.5">
                {links.map((lnk) => (
                  <li key={lnk}>
                    <button
                      onClick={() => handleLinkClick(lnk)}
                      className="text-xs md:text-sm lg:text-base text-slate-450 hover:text-sky-400 hover:translate-x-1 font-semibold transition-all duration-300 block text-left w-full"
                    >
                      {lnk}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1 space-y-4">
            <h4 className="text-[10px] md:text-xs lg:text-sm font-black uppercase tracking-[0.35em] text-slate-500">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: "Privacy Policy", slug: "Privacy" },
                { name: "Terms of Service", slug: "Terms" },
                { name: "Cookies", slug: "Cookies" },
              ].map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleLinkClick(item.slug)}
                    className="text-xs md:text-sm lg:text-base text-slate-450 hover:text-sky-400 hover:translate-x-1 font-semibold transition-all duration-300 block text-left w-full"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] md:text-xs lg:text-sm text-slate-500 font-medium order-3 md:order-1">
            © 2026 CabinHub. All rights reserved.
          </p>

          <p className="text-[10px] md:text-xs lg:text-sm text-slate-600 font-black uppercase tracking-[0.25em] flex items-center gap-2 order-2 md:order-3">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Made for adventurers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
