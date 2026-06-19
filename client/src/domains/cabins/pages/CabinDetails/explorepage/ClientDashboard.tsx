import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useExplore } from "../../../hooks/useExplore";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";
import CabinCard from "../../../components/CabinCard";
import { usePagination } from "@shared/hooks/usePagination";
import Pagination from "@shared/components/ui/Pagination";
import { useScrollToTop, scrollToTop } from "@shared/hooks/useScrollToTop";

import HeroSection from "./HeroSection";
import PopularCabinsSection from "./PopularCabinsSection";
import WhyChooseUs from "./WhyChooseUs";
import SpecialOffers from "./SpecialOffers";
import ExploreLocations from "./ExploreLocations";
import ActivitiesSection from "./ActivitiesSection";
import HowItWorks from "./HowItWorks";
import TestimonialsSection from "./TestimonialsSection";
import { Search, MapPin, ArrowLeft } from "lucide-react";

const ClientDashboard = () => {
  const { isSearching, clearFilters, appliedFilters } = useCabinFiltersContext();
  const { cabins, isLoading, filteredCount } = useExplore();
  const location = useLocation();

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(cabins, 12);

  // Use the hook to handle pagination scrolls
  useScrollToTop([currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFilters, setCurrentPage]);

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

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
      </div>
    );
  }

  // SEARCH RESULTS VIEW
  if (isSearching) {
    return (
      <div
        key={JSON.stringify(appliedFilters)}
        className="space-y-[52px] md:space-y-[56px] lg:space-y-[60px] pb-[52px] md:pb-[56px] lg:pb-[60px] animate-in fade-in duration-700 bg-white dark:bg-slate-950"
      >
        <div className="w-full mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sky-50 dark:border-sky-900/20 pb-8 md:pb-10 pt-6 md:pt-10">
            <div className="space-y-4">
              <div className="space-y-1 flex flex-col items-start">
                <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-sky-900/30 px-3 md:px-4 py-1 md:py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800">
                  <Search size={12} />
                  Refine
                </div>
                <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight md:leading-none">
                  Found <span className="text-sky-500">{filteredCount}</span> Perfect Stays
                </h1>
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

          <div className="mt-12">
            {paginatedData.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedData.map((cabin) => (
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
        <PopularCabinsSection cabins={cabins} filteredCount={filteredCount} />

        {/* 4. Why Choose Us */}
        <WhyChooseUs />

        {/* 5. Special Offers */}
        <SpecialOffers />

        {/* 6. Explore Locations */}
        <ExploreLocations cabins={cabins} />

        {/* 7. Activities */}
        <ActivitiesSection />

        {/* 8. Testimonials */}
        <TestimonialsSection />

        {/* 9. How It Works */}
        <HowItWorks />
      </div>
    </div>
  );
};

export default ClientDashboard;
