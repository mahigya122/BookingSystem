import { useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useExplore } from "../hooks/useExplore";
import { useCabinFiltersContext } from "../contexts/CabinFiltersContext";
import CabinCard from "../components/CabinCard";
import Pagination from "@shared/components/ui/Pagination";
import { useScrollToTop, scrollToTop } from "@shared/hooks/useScrollToTop";

import HeroSection from "./HeroSection";
import { Search, MapPin, ArrowLeft, SlidersHorizontal } from "lucide-react";
import PopularCabinsSkeleton from "@shared/components/skeletons/PopularCabinsSkeleton";
import LazySection from "@shared/components/performance/LazySection";
import SpecialOffersSkeleton from "@shared/components/skeletons/SpecialOffersSkeleton";
import ExploreLocationsSkeleton from "@shared/components/skeletons/ExploreLocationsSkeleton";
import ActivitiesSkeleton from "@shared/components/skeletons/ActivitiesSkeleton";

import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

// Dynamic imports for progressive loading
const PopularCabinsSection = lazy(() => import("./PopularCabinsSection"));
const WhyChooseUs = lazy(() => import("./WhyChooseUs"));
const SpecialOffers = lazy(() => import("./SpecialOffers"));
const ExploreLocations = lazy(() => import("./ExploreLocations"));
const ActivitiesSection = lazy(() => import("./ActivitiesSection"));
const TestimonialsSection = lazy(() => import("./TestimonialsSection"));
const HowItWorks = lazy(() => import("./HowItWorks"));

// Skeletons to prevent layout shift during lazy load
const WhyChooseUsSkeleton = () => (
  <section className={`relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 ${pageSpacing.section} w-full`}>
    <div className={`${layoutConfig.container} grid md:grid-cols-2 gap-16 items-center relative z-10`}>
      <div className="space-y-6">
        <SectionHeader
          label="Why Choose Us"
          title="What Are Our Advantages"
          subtitle="We've obsessed over every detail so your cabin stay is seamless from first click to final morning coffee."
          center={false}
          highlightIndex={3}
        />
        <div className="grid sm:grid-cols-1 gap-4 pt-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-[500px] hidden md:block w-full">
        {/* Main background image shadow */}
        <div className="absolute right-0 top-8 w-64 h-[350px] lg:w-80 lg:h-[450px] rounded-[3rem] bg-slate-200 dark:bg-slate-800 animate-pulse rotate-2 border-4 border-white dark:border-slate-800" />
        {/* Middle connector image shadow */}
        <div className="absolute left-20 top-28 w-55 h-56 lg:w-48 lg:h-64 rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse rotate-12 border-4 border-white dark:border-slate-800" />
        {/* Overlapping front image shadow */}
        <div className="absolute left-10 bottom-16 w-52 h-64 lg:w-60 lg:h-72 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 animate-pulse -rotate-6 border-4 border-white dark:border-slate-800" />
      </div>
    </div>
  </section>
);

const TestimonialsSkeleton = () => (
  <section className={`relative ${pageSpacing.section} overflow-hidden bg-slate-50/50 dark:bg-slate-900/30`}>
    <div className={`relative z-10 ${layoutConfig.container}`}>
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-8 ${layoutConfig.headerMargin}`}>
        <SectionHeader
          label="Guest Experiences"
          title="Real Stories from Our Guests"
          subtitle="Real testimonials from our community of happy explorers."
          center={false}
          highlightIndex={3}
          className="max-w-2xl"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className={`rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse h-[300px] ${idx >= 1 ? "hidden md:block" : ""}`}
          />
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksSkeleton = () => (
  <section className={`relative bg-white dark:bg-slate-950 ${pageSpacing.section} overflow-hidden w-full`}>
    <div className={layoutConfig.container}>
      <SectionHeader
        label="How It Works"
        title="Hassle Free Booking"
        subtitle="A simple guide to your seamless stay."
        highlightIndex={2}
        className={`relative z-10 ${layoutConfig.headerMargin}`}
      />
      <div className="grid md:grid-cols-3 gap-8 relative z-10">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ClientDashboard = () => {
  const { isSearching, clearFilters, appliedFilters, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen } = useCabinFiltersContext();

  // If search is active, use the current page. If on landing page, fetch first page (page 1, size 12)
  const queryPage = isSearching ? currentPage : 1;
  const { cabins = [], isLoading, filteredCount = 0 } = useExplore(queryPage, 12);
  const location = useLocation();

  const totalPages = Math.ceil(filteredCount / 12);

  // Use the hook to handle pagination scrolls
  useScrollToTop([currentPage]);

  // Scroll to section if passed in state (e.g. from footer links on other pages)
  useEffect(() => {
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      // Clear state to prevent re-scroll on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // SEARCH RESULTS VIEW
  if (isSearching) {
    return (
      <div
        key={JSON.stringify(appliedFilters)}
        className="space-y-[52px] md:space-y-[56px] lg:space-y-[60px] pb-8 animate-in fade-in duration-700 bg-white dark:bg-slate-950"
      >
        <div className="w-full mx-auto px-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 md:pt-6">
            <div className="space-y-4">
              <div className="space-y-1 flex items-center justify-between w-full gap-3">
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight md:leading-none">
                  Found <span className="text-sky-500">{filteredCount}</span> Perfect Stays
                </h1>
                <button
                  data-sidebar-toggle="true"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="sidebar-toggle-btn lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors inline-flex items-center justify-center shrink-0 cursor-pointer"
                  title="Toggle Filters"
                >
                  <SlidersHorizontal size={18} className="text-slate-600 dark:text-slate-300" />
                </button>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium flex items-center gap-2">
                <MapPin size={16} className="text-sky-400" />
                Available cabins based on your refined preferences
              </p>
            </div>

            <button
              onClick={() => {
                clearFilters();
                scrollToTop();
              }}
              className="flex items-center justify-center gap-2 px-6 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-[1.5rem] bg-slate-900 dark:bg-sky-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] hover:bg-sky-500 hover:shadow-2xl hover:shadow-sky-500/30 transition-all duration-500 group shadow-lg"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Explore
            </button>
          </div>

          <div className="mt-6 md:mt-8">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl md:rounded-3xl aspect-[4/3] w-full" />
                ))}
              </div>
            ) : cabins.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                  {cabins.map((cabin) => (
                    <CabinCard key={cabin.id} cabin={cabin} />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 px-6 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                <div className="h-20 w-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-xl mb-6">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No matches found</h3>
                <p className="text-slate-400 text-lg text-center max-w-sm">
                  We couldn't find any cabins matching your exact filters. Try broadening your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // LANDING PAGE VIEW
  return (
    <div className="animate-in fade-in duration-700 bg-white dark:bg-slate-950 w-full overflow-x-hidden">
      <div className="relative w-full overflow-x-hidden">
        {/* 1. Hero */}
        <HeroSection />

        {/* 3. Popular Cabins */}
        <LazySection id="popular-cabins" placeholder={<PopularCabinsSkeleton />}>
          <Suspense fallback={<PopularCabinsSkeleton />}>
            <PopularCabinsSection cabins={cabins} filteredCount={filteredCount} isLoading={isLoading} />
          </Suspense>
        </LazySection>

        {/* 4. Why Choose Us */}
        <LazySection placeholder={<WhyChooseUsSkeleton />}>
          <Suspense fallback={<WhyChooseUsSkeleton />}>
            <WhyChooseUs />
          </Suspense>
        </LazySection>

        {/* 5. Special Offers */}
        <LazySection id="special-offers" placeholder={<SpecialOffersSkeleton />}>
          <Suspense fallback={<SpecialOffersSkeleton />}>
            <SpecialOffers />
          </Suspense>
        </LazySection>

        {/* 6. Explore Locations */}
        <LazySection id="explore-locations" placeholder={<ExploreLocationsSkeleton />}>
          <Suspense fallback={<ExploreLocationsSkeleton />}>
            <ExploreLocations cabins={cabins} />
          </Suspense>
        </LazySection>

        {/* 7. Activities */}
        <LazySection id="activities-section" placeholder={<ActivitiesSkeleton />}>
          <Suspense fallback={<ActivitiesSkeleton />}>
            <ActivitiesSection />
          </Suspense>
        </LazySection>

        {/* 8. Testimonials */}
        <LazySection placeholder={<TestimonialsSkeleton />}>
          <Suspense fallback={<TestimonialsSkeleton />}>
            <TestimonialsSection />
          </Suspense>
        </LazySection>

        {/* 9. How It Works */}
        <LazySection placeholder={<HowItWorksSkeleton />}>
          <Suspense fallback={<HowItWorksSkeleton />}>
            <HowItWorks />
          </Suspense>
        </LazySection>
      </div>
    </div>
  );
};

export default ClientDashboard;
