import { useNavigate } from "react-router-dom";
import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";
import { Compass, MapPinned, ShieldCheck } from "lucide-react";
import PageHero from "../component/PageHero";
import AboutPageSkeleton from "../component/AboutPageSkeleton";
import { useSimulatedLoad } from "./useSimulatedLoad";

const STATS = [
  { value: "500+", label: "Cabins Listed" },
  { value: "40+", label: "Countries" },
  { value: "98%", label: "Guest Satisfaction" },
  { value: "24/7", label: "Concierge Support" },
];

const VALUES = [
  {
    icon: MapPinned,
    title: "Handpicked, Not Crowdsourced",
    desc: "Every cabin is scouted and approved by our team before it ever goes live — no open marketplace, no surprises.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Every Stay",
    desc: "Hosts are vetted, listings are checked in person, and your booking and payment are protected end to end.",
  },
  {
    icon: Compass,
    title: "Local at Heart",
    desc: "Our hosts live where they host. They'll point you to the trail, the lake, or the bakery a map won't show you.",
  },
];

const AboutPage = () => {
  const isLoading = useSimulatedLoad();
  const navigate = useNavigate();

  if (isLoading) return <AboutPageSkeleton />;

  return (
    <div className="flex-grow bg-white dark:bg-slate-950">
      <PageHero
        label="About Us"
        title="We handpick the cabins that make leaving the city worth it."
        subtitle="No open marketplace. No stock photos. Just places our team has actually stood in."
      />

      {/* STORY + STATS */}
      <section className={`${pageSpacing.section} w-full`}>
        <div
          className={`${layoutConfig.container} grid md:grid-cols-2 gap-16 items-center`}
        >
          <div className="relative h-[340px] md:h-[420px]">
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=700&q=80"
                alt="A CabinHub host cabin in the forest"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-sky-500 text-white px-6 py-4 rounded-2xl shadow-2xl rotate-2 hidden sm:block">
              <p className="text-2xl font-black">5+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                Years Curating
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
              CabinHub started with three forest hideaways and a simple rule:
              we'd only list a place we'd send our own families to. That rule
              hasn't changed as we've grown to hundreds of cabins across 40+
              countries.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
              Every listing is scouted, every host is verified, and every
              booking is backed by a concierge team that's reachable around the
              clock — because a good escape shouldn't come with fine print.
            </p>
            <button
              onClick={() => navigate("/explorepage")}
              className="inline-flex items-center rounded-full bg-sky-500 hover:bg-sky-600 text-white font-black px-8 py-4 text-sm shadow-xl shadow-sky-200 dark:shadow-none transition-all duration-300 hover:-translate-y-1 active:scale-95"
            >
              Explore Cabins
            </button>
          </div>
        </div>

        {/* Stat bar */}
        <div
          className={`${layoutConfig.container} mt-16 pt-10 border-t border-slate-100 dark:border-slate-800`}
        >
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section
        className={`${pageSpacing.section} bg-slate-50/50 dark:bg-slate-900/30 w-full`}
      >
        <div className={layoutConfig.container}>
          <SectionHeader
            label="Our Values"
            title="What Makes CabinHub Different"
            subtitle="Three things we won't compromise on, no matter how big the portfolio gets."
            highlightIndex={0}
            className={layoutConfig.headerMargin}
          />

          <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-900/50 transition-colors duration-300 space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="font-black text-slate-900 dark:text-white text-sm tracking-tight">
                  {title}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
