import { Mountain, Heart } from "lucide-react";
import {
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
  FaPinterestP,
} from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";

const footerLinks = {
  Navigation: [
    "About",
    "Blog",
    "Careers",
    "Cookies",
    "FAQs",
    "Help Center",
    "Privacy Policy",
  ],
};

const socialLinks = [
  { icon: FaLinkedinIn, name: "LinkedIn" },
  { icon: FaInstagram, name: "Instagram" },
  { icon: FaTiktok, name: "TikTok" },
  { icon: FaPinterestP, name: "Pinterest" },
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (lnk: string) => {
    const slug = lnk.toLowerCase().replace(/ /g, "-");
    const targetPath = `/info/${slug}`;

    if (location.pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(targetPath);
    }
  };

  return (
    <footer className="relative overflow-hidden shrink-0 bg-[#1e3a5f] dark:bg-[#1e3a5f]">
      
      {/* ========================================== */}
      {/* BACKGROUND ILLUSTRATION (Now Absolute)     */}
      {/* ========================================== */}
      <div className="absolute inset-0 w-full h-full">
        {/* LIGHT MODE - SUNNY & CLEAR */}
        <div className="block dark:hidden w-full h-full">
          <svg
            viewBox="0 50 1440 275"
            className="w-full h-full block"
            preserveAspectRatio="xMidYMax slice"
          >
            <defs>
              <linearGradient id="lightSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87ceeb" />
                <stop offset="100%" stopColor="#b8e0f0" />
              </linearGradient>
              
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff8dc" stopOpacity="0.8" />
                <stop offset="70%" stopColor="#ffd700" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="lightHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#90a955" />
                <stop offset="100%" stopColor="#7a9157" />
              </linearGradient>
              
              <linearGradient id="lightHillMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a3b855" />
                <stop offset="100%" stopColor="#8a9e4a" />
              </linearGradient>
              
              <linearGradient id="lightHillNear" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b5c96a" />
                <stop offset="100%" stopColor="#9aaf5a" />
              </linearGradient>

              <linearGradient id="lightCabinBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f4e4c1" />
                <stop offset="100%" stopColor="#d4b896" />
              </linearGradient>

              <linearGradient id="lightCabinRoof" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e07a5f" />
                <stop offset="100%" stopColor="#c45a4a" />
              </linearGradient>

              <radialGradient id="lightWindowGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff5b8" />
                <stop offset="100%" stopColor="#ffd700" />
              </radialGradient>
            </defs>

            <rect width="1440" height="380" fill="url(#lightSky)" />
            <circle cx="200" cy="80" r="50" fill="url(#sunGlow)" />
            <circle cx="200" cy="80" r="25" fill="#ffd700" />

            <g fill="#ffffff" opacity="0.95">
              <ellipse cx="300" cy="90" rx="65" ry="30" />
              <ellipse cx="340" cy="78" rx="45" ry="26" />
              <ellipse cx="380" cy="90" rx="60" ry="28" />
              <ellipse cx="750" cy="75" rx="70" ry="32" />
              <ellipse cx="795" cy="62" rx="50" ry="28" />
              <ellipse cx="840" cy="75" rx="65" ry="30" />
              <ellipse cx="1150" cy="95" rx="60" ry="28" />
              <ellipse cx="1188" cy="82" rx="42" ry="24" />
              <ellipse cx="1225" cy="95" rx="55" ry="26" />
            </g>

            <path d="M0,200 Q100,170 220,185 Q340,165 480,180 Q620,160 760,178 Q900,162 1040,182 Q1180,168 1320,185 Q1400,175 1440,188 L1440,240 L0,240 Z" fill="url(#lightHillFar)" />
            <path d="M0,230 Q120,210 260,222 Q400,205 560,218 Q720,200 880,220 Q1040,205 1200,222 Q1340,210 1440,225 L1440,280 L0,280 Z" fill="url(#lightHillMid)" />
            <path d="M0,260 Q150,240 320,255 Q500,238 680,252 Q860,235 1040,255 Q1220,240 1440,258 L1440,320 L0,320 Z" fill="url(#lightHillNear)" />
            <path d="M0,300 Q200,292 400,298 Q600,290 800,296 Q1000,288 1200,295 Q1350,290 1440,294 L1440,320 L0,320 Z" fill="#8a9e4a" />

            <g>
              <ellipse cx="220" cy="110" rx="28" ry="34" fill="#ff6b9d" />
              <path d="M220,76 L220,144" stroke="#fff" strokeWidth="1" opacity="0.6" />
              <path d="M192,110 Q220,120 248,110" stroke="#fff" strokeWidth="1" opacity="0.5" />
              <line x1="210" y1="142" x2="205" y2="158" stroke="#8b6f6f" strokeWidth="1.5" />
              <line x1="230" y1="142" x2="235" y2="158" stroke="#8b6f6f" strokeWidth="1.5" />
              <rect x="200" y="158" width="20" height="10" rx="2" fill="#f4a460" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="5s" repeatCount="indefinite" />
            </g>

            <g>
              <ellipse cx="480" cy="140" rx="22" ry="28" fill="#5db3e0" />
              <line x1="472" y1="166" x2="468" y2="180" stroke="#8b6f6f" strokeWidth="1.5" />
              <line x1="488" y1="166" x2="492" y2="180" stroke="#8b6f6f" strokeWidth="1.5" />
              <rect x="464" y="180" width="16" height="8" rx="1.5" fill="#f4a460" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-4; 0,0" dur="6s" repeatCount="indefinite" />
            </g>

            <g>
              <ellipse cx="920" cy="95" rx="32" ry="40" fill="#ff6b9d" />
              <path d="M920,55 L920,135" stroke="#fff" strokeWidth="1.2" opacity="0.6" />
              <path d="M888,95 Q920,106 952,95" stroke="#fff" strokeWidth="1" opacity="0.5" />
              <line x1="908" y1="133" x2="902" y2="152" stroke="#8b6f6f" strokeWidth="1.5" />
              <line x1="932" y1="133" x2="938" y2="152" stroke="#8b6f6f" strokeWidth="1.5" />
              <rect x="896" y="152" width="24" height="12" rx="2" fill="#f4a460" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-6; 0,0" dur="5.5s" repeatCount="indefinite" />
            </g>

            <g>
              <ellipse cx="1220" cy="130" rx="20" ry="26" fill="#7ec98f" />
              <line x1="1213" y1="154" x2="1210" y2="168" stroke="#8b6f6f" strokeWidth="1.5" />
              <line x1="1227" y1="154" x2="1230" y2="168" stroke="#8b6f6f" strokeWidth="1.5" />
              <rect x="1206" y="168" width="14" height="7" rx="1.5" fill="#f4a460" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-4; 0,0" dur="6.5s" repeatCount="indefinite" />
            </g>

            <g>
              <path d="M130,300 L110,260 L125,262 L108,228 L122,230 L105,195 L120,198 L115,175 L145,175 L140,198 L155,195 L138,230 L152,228 L135,262 L150,260 Z" fill="#2d5a3d" />
              <rect x="127" y="300" width="6" height="18" fill="#4a3728" />
            </g>
            <g>
              <path d="M175,305 L158,270 L170,272 L155,242 L167,244 L152,212 L165,214 L162,195 L188,195 L185,214 L198,212 L183,244 L195,242 L180,272 L192,270 Z" fill="#3d6b4d" />
              <rect x="172" y="305" width="6" height="15" fill="#4a3728" />
            </g>
            <g>
              <path d="M215,310 L202,282 L212,284 L200,258 L210,260 L198,235 L208,237 L206,220 L224,220 L222,237 L232,235 L220,260 L230,258 L218,284 L228,282 Z" fill="#4d7b5d" />
              <rect x="213" y="310" width="4" height="10" fill="#4a3728" />
            </g>

            <g>
              <path d="M1130,298 L1108,255 L1125,257 L1105,220 L1122,222 L1102,182 L1120,185 L1115,158 L1145,158 L1140,185 L1158,182 L1138,222 L1155,220 L1135,257 L1152,255 Z" fill="#2d5a3d" />
              <rect x="1127" y="298" width="6" height="20" fill="#4a3728" />
            </g>
            <g>
              <path d="M1185,302 L1166,265 L1180,267 L1163,235 L1177,237 L1160,202 L1175,204 L1172,182 L1198,182 L1195,204 L1210,202 L1193,237 L1207,235 L1190,267 L1204,265 Z" fill="#3d6b4d" />
              <rect x="1182" y="302" width="6" height="16" fill="#4a3728" />
            </g>
            <g>
              <path d="M1235,308 L1220,278 L1232,280 L1218,252 L1230,254 L1216,226 L1228,228 L1226,210 L1244,210 L1242,228 L1254,226 L1240,254 L1252,252 L1238,280 L1250,278 Z" fill="#4d7b5d" />
              <rect x="1233" y="308" width="4" height="12" fill="#4a3728" />
            </g>
            <g>
              <path d="M1280,312 L1268,288 L1278,290 L1266,268 L1276,270 L1264,248 L1274,250 L1272,236 L1288,236 L1286,250 L1296,248 L1284,270 L1294,268 L1282,290 L1292,288 Z" fill="#5d8b6d" />
              <rect x="1278" y="312" width="4" height="8" fill="#4a3728" />
            </g>

            <g>
              <ellipse cx="720" cy="300" rx="75" ry="8" fill="#4a3728" opacity="0.3" />
              <rect x="660" y="230" width="120" height="70" rx="2" fill="url(#lightCabinBody)" />
              <line x1="660" y1="250" x2="780" y2="250" stroke="#b8956a" strokeWidth="1" opacity="0.5" />
              <line x1="660" y1="270" x2="780" y2="270" stroke="#b8956a" strokeWidth="1" opacity="0.5" />
              <line x1="660" y1="290" x2="780" y2="290" stroke="#b8956a" strokeWidth="1" opacity="0.5" />
              <path d="M648,232 L720,180 L792,232 Z" fill="url(#lightCabinRoof)" />
              <path d="M648,232 L720,180 L792,232" fill="none" stroke="#a04a3a" strokeWidth="1.5" />
              <rect x="745" y="195" width="14" height="28" fill="#c45a4a" />
              <rect x="743" y="193" width="18" height="4" fill="#a04a3a" />
              <path d="M752,190 Q750,180 754,172 Q752,165 756,158" stroke="#f0f0f0" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
              <path d="M710,300 L710,268 A10,10 0 0 1 730,268 L730,300 Z" fill="#3a2a1a" />
              <circle cx="725" cy="282" r="2" fill="#d4af37" />
              <rect x="672" y="245" width="22" height="22" rx="1.5" fill="url(#lightWindowGlow)" />
              <rect x="672" y="245" width="22" height="22" rx="1.5" fill="none" stroke="#b8956a" strokeWidth="1.5" />
              <line x1="683" y1="245" x2="683" y2="267" stroke="#b8956a" strokeWidth="1.2" />
              <line x1="672" y1="256" x2="694" y2="256" stroke="#b8956a" strokeWidth="1.2" />
              <rect x="746" y="245" width="22" height="22" rx="1.5" fill="url(#lightWindowGlow)" />
              <rect x="746" y="245" width="22" height="22" rx="1.5" fill="none" stroke="#b8956a" strokeWidth="1.5" />
              <line x1="757" y1="245" x2="757" y2="267" stroke="#b8956a" strokeWidth="1.2" />
              <line x1="746" y1="256" x2="768" y2="256" stroke="#b8956a" strokeWidth="1.2" />
              <circle cx="720" cy="215" r="8" fill="url(#lightWindowGlow)" />
              <circle cx="720" cy="215" r="8" fill="none" stroke="#b8956a" strokeWidth="1.2" />
              <line x1="720" y1="207" x2="720" y2="223" stroke="#b8956a" strokeWidth="1" />
              <line x1="712" y1="215" x2="728" y2="215" stroke="#b8956a" strokeWidth="1" />
            </g>

            <g stroke="#7a9157" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M80,315 Q82,308 84,315 Q86,306 88,315" />
              <path d="M380,318 Q382,311 384,318 Q386,309 388,318" />
              <path d="M560,316 Q562,309 564,316 Q566,307 568,316" />
              <path d="M880,317 Q882,310 884,317 Q886,308 888,317" />
              <path d="M1050,315 Q1052,308 1054,315 Q1056,306 1058,315" />
              <path d="M1340,316 Q1342,309 1344,316 Q1346,307 1348,316" />
            </g>
          </svg>
        </div>

        {/* DARK MODE - MOODY & ATMOSPHERIC */}
        <div className="hidden dark:block w-full h-full">
          <svg
            viewBox="0 50 1440 275"
            className="w-full h-full block"
            preserveAspectRatio="xMidYMax slice"
          >
            <defs>
              <linearGradient id="darkSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2d4a6f" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="hillFar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7c9db5" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#5a7d95" stopOpacity="0.25" />
              </linearGradient>
              <linearGradient id="hillMid" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8fb8a0" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#6b9a82" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="hillNear" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a8c9b5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#7fa894" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="cabinBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f5deb3" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#d4a574" stopOpacity="0.75" />
              </linearGradient>
              <linearGradient id="cabinRoof" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c97b63" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a85a42" stopOpacity="0.7" />
              </linearGradient>
              <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.5" />
              </radialGradient>
              <filter id="softBlur"><feGaussianBlur stdDeviation="0.8" /></filter>
              <filter id="windowGlowFilter">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <circle cx="1100" cy="80" r="60" fill="url(#moonGlow)" />
            <circle cx="1100" cy="80" r="22" fill="#fef3c7" opacity="0.5" filter="url(#softBlur)" />

            <g opacity="0.6" filter="url(#softBlur)">
              <path d="M120,90 Q140,75 170,80 Q195,70 220,82 Q245,78 260,92 Q250,105 220,102 Q190,108 160,100 Q135,105 120,90 Z" fill="#e8e4df" />
              <path d="M580,70 Q610,55 645,62 Q680,52 710,65 Q735,60 750,75 Q740,90 705,88 Q670,95 635,85 Q605,92 580,70 Z" fill="#e8e4df" />
              <path d="M1050,95 Q1075,82 1105,88 Q1135,78 1160,92 Q1180,88 1195,100 Q1185,112 1155,110 Q1125,116 1095,108 Q1070,112 1050,95 Z" fill="#e8e4df" />
            </g>

            <path d="M0,200 Q100,170 220,185 Q340,165 480,180 Q620,160 760,178 Q900,162 1040,182 Q1180,168 1320,185 Q1400,175 1440,188 L1440,240 L0,240 Z" fill="url(#hillFar)" />
            <path d="M0,230 Q120,210 260,222 Q400,205 560,218 Q720,200 880,220 Q1040,205 1200,222 Q1340,210 1440,225 L1440,280 L0,280 Z" fill="url(#hillMid)" />
            <path d="M0,260 Q150,240 320,255 Q500,238 680,252 Q860,235 1040,255 Q1220,240 1440,258 L1440,320 L0,320 Z" fill="url(#hillNear)" />
            <path d="M0,300 Q200,292 400,298 Q600,290 800,296 Q1000,288 1200,295 Q1350,290 1440,294 L1440,320 L0,320 Z" fill="#7fa894" opacity="0.35" />

            <g opacity="0.75">
              <ellipse cx="220" cy="110" rx="28" ry="34" fill="#d4a5a5" opacity="0.7" />
              <path d="M220,76 Q220,110 220,144" stroke="#8b6f6f" strokeWidth="1" opacity="0.5" />
              <path d="M192,110 Q220,120 248,110" stroke="#8b6f6f" strokeWidth="1" opacity="0.4" />
              <line x1="210" y1="142" x2="205" y2="158" stroke="#8b6f6f" strokeWidth="1" opacity="0.6" />
              <line x1="230" y1="142" x2="235" y2="158" stroke="#8b6f6f" strokeWidth="1" opacity="0.6" />
              <rect x="200" y="158" width="20" height="10" rx="2" fill="#c9a87c" opacity="0.7" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-4; 0,0" dur="6s" repeatCount="indefinite" />
            </g>
            <g opacity="0.6">
              <ellipse cx="480" cy="140" rx="22" ry="28" fill="#a5b8d4" opacity="0.7" />
              <line x1="472" y1="166" x2="468" y2="180" stroke="#6b7d8f" strokeWidth="1" opacity="0.5" />
              <line x1="488" y1="166" x2="492" y2="180" stroke="#6b7d8f" strokeWidth="1" opacity="0.5" />
              <rect x="464" y="180" width="16" height="8" rx="1.5" fill="#c9a87c" opacity="0.6" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="7s" repeatCount="indefinite" />
            </g>
            <g opacity="0.7">
              <ellipse cx="920" cy="95" rx="32" ry="40" fill="#d4a5a5" opacity="0.7" />
              <path d="M920,55 Q920,95 920,135" stroke="#8b6f6f" strokeWidth="1.2" opacity="0.5" />
              <path d="M888,95 Q920,106 952,95" stroke="#8b6f6f" strokeWidth="1" opacity="0.4" />
              <line x1="908" y1="133" x2="902" y2="152" stroke="#8b6f6f" strokeWidth="1.2" opacity="0.6" />
              <line x1="932" y1="133" x2="938" y2="152" stroke="#8b6f6f" strokeWidth="1.2" opacity="0.6" />
              <rect x="896" y="152" width="24" height="12" rx="2" fill="#c9a87c" opacity="0.7" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-5; 0,0" dur="6.5s" repeatCount="indefinite" />
            </g>
            <g opacity="0.55">
              <ellipse cx="1220" cy="130" rx="20" ry="26" fill="#a5c4b5" opacity="0.7" />
              <line x1="1213" y1="154" x2="1210" y2="168" stroke="#6b8a7a" strokeWidth="1" opacity="0.5" />
              <line x1="1227" y1="154" x2="1230" y2="168" stroke="#6b8a7a" strokeWidth="1" opacity="0.5" />
              <rect x="1206" y="168" width="14" height="7" rx="1.5" fill="#c9a87c" opacity="0.6" />
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-3; 0,0" dur="7.5s" repeatCount="indefinite" />
            </g>

            <g opacity="0.85">
              <path d="M130,300 L110,260 L125,262 L108,228 L122,230 L105,195 L120,198 L115,175 L145,175 L140,198 L155,195 L138,230 L152,228 L135,262 L150,260 Z" fill="#6b8a7a" opacity="0.7" />
              <rect x="127" y="300" width="6" height="18" fill="#5a4a3a" opacity="0.7" />
            </g>
            <g opacity="0.75">
              <path d="M175,305 L158,270 L170,272 L155,242 L167,244 L152,212 L165,214 L162,195 L188,195 L185,214 L198,212 L183,244 L195,242 L180,272 L192,270 Z" fill="#7fa894" opacity="0.7" />
              <rect x="172" y="305" width="6" height="15" fill="#5a4a3a" opacity="0.7" />
            </g>
            <g opacity="0.65">
              <path d="M215,310 L202,282 L212,284 L200,258 L210,260 L198,235 L208,237 L206,220 L224,220 L222,237 L232,235 L220,260 L230,258 L218,284 L228,282 Z" fill="#8fb8a0" opacity="0.65" />
              <rect x="213" y="310" width="4" height="10" fill="#5a4a3a" opacity="0.65" />
            </g>
            <g opacity="0.85">
              <path d="M1130,298 L1108,255 L1125,257 L1105,220 L1122,222 L1102,182 L1120,185 L1115,158 L1145,158 L1140,185 L1158,182 L1138,222 L1155,220 L1135,257 L1152,255 Z" fill="#6b8a7a" opacity="0.7" />
              <rect x="1127" y="298" width="6" height="20" fill="#5a4a3a" opacity="0.7" />
            </g>
            <g opacity="0.75">
              <path d="M1185,302 L1166,265 L1180,267 L1163,235 L1177,237 L1160,202 L1175,204 L1172,182 L1198,182 L1195,204 L1210,202 L1193,237 L1207,235 L1190,267 L1204,265 Z" fill="#7fa894" opacity="0.7" />
              <rect x="1182" y="302" width="6" height="16" fill="#5a4a3a" opacity="0.7" />
            </g>
            <g opacity="0.65">
              <path d="M1235,308 L1220,278 L1232,280 L1218,252 L1230,254 L1216,226 L1228,228 L1226,210 L1244,210 L1242,228 L1254,226 L1240,254 L1252,252 L1238,280 L1250,278 Z" fill="#8fb8a0" opacity="0.65" />
              <rect x="1233" y="308" width="4" height="12" fill="#5a4a3a" opacity="0.65" />
            </g>
            <g opacity="0.55">
              <path d="M1280,312 L1268,288 L1278,290 L1266,268 L1276,270 L1264,248 L1274,250 L1272,236 L1288,236 L1286,250 L1296,248 L1284,270 L1294,268 L1282,290 L1292,288 Z" fill="#a8c9b5" opacity="0.6" />
              <rect x="1278" y="312" width="4" height="8" fill="#5a4a3a" opacity="0.6" />
            </g>

            <g opacity="0.9">
              <ellipse cx="720" cy="300" rx="75" ry="8" fill="#5a4a3a" opacity="0.3" />
              <rect x="660" y="230" width="120" height="70" rx="2" fill="url(#cabinBody)" />
              <line x1="660" y1="250" x2="780" y2="250" stroke="#a87a4a" strokeWidth="0.8" opacity="0.4" />
              <line x1="660" y1="270" x2="780" y2="270" stroke="#a87a4a" strokeWidth="0.8" opacity="0.4" />
              <line x1="660" y1="290" x2="780" y2="290" stroke="#a87a4a" strokeWidth="0.8" opacity="0.4" />
              <path d="M648,232 L720,180 L792,232 Z" fill="url(#cabinRoof)" />
              <path d="M648,232 L720,180 L792,232" fill="none" stroke="#8b4a32" strokeWidth="1.5" opacity="0.6" />
              <rect x="745" y="195" width="14" height="35" fill="#f87171" stroke="#ef4444" strokeWidth="2" />
              <g opacity="0.5">
                <path d="M752,190 Q750,180 754,172 Q752,165 756,158" stroke="#e8e4df" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6">
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="4s" repeatCount="indefinite" />
                </path>
              </g>
              <path d="M710,300 L710,268 A10,10 0 0 1 730,268 L730,300 Z" fill="#1e3a5f" stroke="#0f172a" strokeWidth="2.5" />
              <circle cx="7" cy="62" r="3.5" fill="#fbbf24" />
              <g filter="url(#windowGlowFilter)">
                <rect x="672" y="245" width="24" height="24" rx="2" fill="url(#windowGlow)" />
                <rect x="677" y="250" width="14" height="14" fill="#fbbf24" opacity="0.85">
                  <animate attributeName="opacity" values="0.85;1;0.85" dur="2.5s" repeatCount="indefinite" />
                </rect>
                <line x1="684" y1="245" x2="684" y2="269" stroke="#f59e0b" strokeWidth="2" />
                <line x1="672" y1="257" x2="696" y2="257" stroke="#f59e0b" strokeWidth="2" />
                <rect x="746" y="245" width="24" height="24" rx="2" fill="url(#windowGlow)" />
                <rect x="751" y="250" width="14" height="14" fill="#fbbf24" opacity="0.85">
                  <animate attributeName="opacity" values="0.85;1;0.85" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
                </rect>
                <line x1="758" y1="245" x2="758" y2="269" stroke="#f59e0b" strokeWidth="2" />
                <line x1="746" y1="257" x2="770" y2="257" stroke="#f59e0b" strokeWidth="2" />
              </g>
              <circle cx="720" cy="215" r="10" fill="url(#windowGlow)" opacity="0.9" />
              <circle cx="720" cy="215" r="6" fill="#fbbf24" opacity="0.85">
                <animate attributeName="opacity" values="0.85;1;0.85" dur="2.5s" begin="0.6s" repeatCount="indefinite" />
              </circle>
            </g>

            <g opacity="0.5">
              <path d="M80,315 Q82,308 84,315 Q86,306 88,315" stroke="#7fa894" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M380,318 Q382,311 384,318 Q386,309 388,318" stroke="#7fa894" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M560,316 Q562,309 564,316 Q566,307 568,316" stroke="#7fa894" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M880,317 Q882,310 884,317 Q886,308 888,317" stroke="#7fa894" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M1050,315 Q1052,308 1054,315 Q1056,306 1058,315" stroke="#7fa894" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              <path d="M1340,316 Q1342,309 1344,316 Q1346,307 1348,316" stroke="#7fa894" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>

      {/* Stronger gradient overlay at the bottom for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/95 via-[#1e3a5f]/70 to-[#1e3a5f]/20 pointer-events-none" />

      {/* ========================================== */}
      {/* CONTENT SECTION (Layered on top)           */}
      {/* ========================================== */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-6 items-start">
          <div className="space-y-5">
            <h4 className="text-base font-black uppercase tracking-[0.3em] text-sky-300">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.Navigation.map((lnk) => (
                <li key={lnk}>
                  <button
                    onClick={() => handleLinkClick(lnk)}
                    className="text-base font-bold text-white hover:text-emerald-300 transition-all duration-300 cursor-pointer text-left hover:translate-x-1"
                  >
                    {lnk}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center space-y-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mountain className="h-7 w-7 text-emerald-300" />
              <span className="text-3xl font-black text-white">CabinHub</span>
            </div>
            <h3 className="text-4xl font-black text-white tracking-tight">
              Say Hi!
            </h3>
            <p className="text-base font-semibold text-white">
              Interested in booking a stay with us?
            </p>
            <button
              onClick={() => navigate("/cabins")}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-emerald-300 to-sky-300 text-[#1e3a5f] text-base font-black uppercase tracking-wider hover:from-emerald-200 hover:to-sky-200 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-emerald-500/30 cursor-pointer"
            >
              Explore!
            </button>
          </div>

          <div className="space-y-5 md:text-right">
            <div className="flex gap-4 md:justify-end">
              {socialLinks.map((s, i) => {
                const Icon = s.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    aria-label={s.name}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-gradient-to-br hover:from-emerald-400 hover:to-sky-400 hover:text-[#1e3a5f] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
                  >
                    <Icon size={22} />
                  </a>
                );
              })}
            </div>

            <p className="text-sm font-bold text-white">
              © 2026 Cabin Stays
            </p>
            
            <div className="md:flex md:justify-end">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors duration-300">
                <Heart className="w-4 h-4 text-emerald-300 fill-emerald-300" />
                <span className="text-xs font-bold text-emerald-300">
                  Built with love by MahigyaDahal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;