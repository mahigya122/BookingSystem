import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PageHeroProps {
  label: string;
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

/**
 * Compact dark hero used across every guest info/blog page.
 * Mirrors the eyebrow + heading rhythm used by SectionHeader on the
 * homepage sections, but sits on a dark band the way the site's
 * "About" band does — keeps every footer page visually consistent
 * with each other instead of each having its own one-off hero.
 */
const PageHero = ({
  label,
  title,
  subtitle,
  showBack = true,
}: PageHeroProps) => (
  <section
    className={`relative overflow-hidden bg-slate-950 ${pageSpacing.section}`}
  >
    {/* soft glow accents, same language as the dashed-circle/blur decorations elsewhere */}
    <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

    {showBack && (
      <Link
        to="/"
        className="absolute top-6 left-4 md:left-6 z-20 flex items-center gap-2 text-white/50 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={14} /> Back
      </Link>
    )}

    <div
      className={`${layoutConfig.container} relative z-10 text-center space-y-3`}
    >
      <p className="text-sky-400 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
        {label}
      </p>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1] max-w-2xl mx-auto">
        {title}
      </h1>
      {subtitle && (
        <p className="text-slate-400 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed pt-1">
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

export default PageHero;
