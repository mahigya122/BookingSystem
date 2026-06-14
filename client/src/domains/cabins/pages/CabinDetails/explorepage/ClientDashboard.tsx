import { useEffect } from "react";
import { useExplore } from "../../../hooks/useExplore";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";
import CabinCard from "../../../components/CabinCard";

import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import PopularCabinsSection from "./PopularCabinsSection";
import WhyChooseUs from "./WhyChooseUs";
import SpecialOffers from "./SpecialOffers";
import ExploreLocations from "./ExploreLocations";
import ActivitiesSection from "./ActivitiesSection";
import HowItWorks from "./HowItWorks";
import TestimonialsSection from "./TestimonialsSection";
import NewsletterCTA from "./NewsletterCTA";
import ExploreFooter from "./ExploreFooter";
import { Search, MapPin, ArrowLeft } from "lucide-react";

const ClientDashboard = () => {
  const { isSearching, isRefreshing, clearFilters, appliedFilters } = useCabinFiltersContext();
  const { cabins, isLoading, filteredCount } = useExplore();

  // Automatically scroll to results when searching or filters change
  useEffect(() => {
    if (isSearching || isRefreshing) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSearching, isRefreshing, appliedFilters]);

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
        className="space-y-12 pb-16 animate-in fade-in duration-700"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sky-50 dark:border-sky-900/20 pb-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 dark:bg-sky-900/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-800">
              <Search size={12} />
              Search Results
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Found <span className="text-sky-500">{filteredCount}</span> Perfect Stays
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
              <MapPin size={14} className="text-sky-400" />
              Available cabins based on your refined preferences
            </p>
          </div>

          <button
            onClick={() => {
              clearFilters();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-8 py-4 rounded-[1.5rem] bg-slate-900 dark:bg-sky-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-sky-500 hover:shadow-2xl hover:shadow-sky-500/30 transition-all duration-500 group shadow-lg"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Explore
          </button>
        </div>

        {cabins.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cabins.map((cabin) => (
              <CabinCard key={cabin.id} cabin={cabin} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="h-20 w-20 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-xl mb-6">
              <Search size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No matches found</h3>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              We couldn't find any cabins matching your exact filters. Try broadening your search.
            </p>
          </div>
        )}
      </div>
    );
  }

  // LANDING PAGE VIEW
  return (
    <div className="space-y-16 pb-16 animate-in fade-in duration-700">
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Stats */}
      <StatsSection />

      {/*
        3. Popular Cabins
           • uses cabins.slice(0, 6)
           • renders <CabinCard cabin={cabin} /> with unchanged props
           • shows filteredCount
           • shows empty state when cabins.length === 0
      */}
      <PopularCabinsSection cabins={cabins} filteredCount={filteredCount} />

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. Special Offers */}
      <SpecialOffers />

      {/* 6. Explore Locations */}
      <ExploreLocations cabins={cabins} />

      {/* 7. Activities */}
      <ActivitiesSection />

      {/* 8. How It Works */}
      <HowItWorks />

      {/* 9. Testimonials */}
      <TestimonialsSection />

      {/* 10. Newsletter CTA */}
      <NewsletterCTA />

      {/* 11. Footer */}
      <ExploreFooter />
    </div>
  );
};

export default ClientDashboard;