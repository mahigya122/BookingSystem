import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, type ComponentType } from "react";

interface InfoPageLayoutProps {
  title: string;
  subtitle: string;
  icon: ComponentType<{
    className?: string;
    strokeWidth?: number;
    size?: number;
  }>;
  heroImage?: string;
  children: React.ReactNode;
}

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80";

/**
 * Shared hero + prose layout for the static info pages.
 * Each page (AboutPage, TermsPage, etc.) is its own route component that
 * renders this layout with its own copy — so content stays independent
 * per-page while the chrome stays consistent.
 */
const InfoPageLayout = ({
  title,
  subtitle,
  icon: Icon,
  heroImage,
  children,
}: InfoPageLayoutProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex-grow bg-white dark:bg-slate-950">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 opacity-40">
          <img
            src={heroImage ?? DEFAULT_HERO_IMAGE}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center space-y-6 max-w-4xl px-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500 shadow-2xl shadow-sky-500/40 mb-2">
            <Icon className="h-8 w-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p
            className="text-lg md:text-2xl text-sky-400 font-bold italic"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            {subtitle}
          </p>
        </div>

        <Link
          to="/"
          className="absolute top-10 left-10 z-20 flex items-center gap-2 text-white/70 hover:text-white font-black text-xs uppercase tracking-widest transition-colors group"
        >
          <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-950 transition-all">
            <ArrowLeft size={18} />
          </div>
          <span>Back to Home</span>
        </Link>
      </section>

      {/* CONTENT SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-24 space-y-12">
        {children}
      </section>
    </div>
  );
};

export default InfoPageLayout;
