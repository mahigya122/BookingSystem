import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
// We import the context directly to check if it exists before using useCabinFiltersContext
// which throws an error if context is missing.
import { useCabinFiltersContext } from "../../domains/cabins/contexts/CabinFiltersContext";

/**
 * Utility to find the nearest scrollable parent and scroll it to top
 */
export const scrollToTop = (element?: HTMLElement | null) => {
  const scrollable = element || document.querySelector("main") || document.querySelector(".overflow-y-auto") || window;
  scrollable.scrollTo({ top: 0, behavior: "smooth" });
};

/**
 * Hook to scroll a container to top on navigation or filter changes
 * @param extraDeps Optional extra dependencies to trigger a scroll to top (e.g. pagination)
 */
export const useScrollToTop = (extraDeps: any[] = []) => {
  const { pathname, search } = useLocation();
  let appliedFilters = null;
  
  try {
    // Try to get filters if context exists
    const context = useCabinFiltersContext();
    appliedFilters = context.appliedFilters;
  } catch {
    // Context not available, ignore filters
  }

  const containerRef = useRef<HTMLElement | HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        // Fallback to searching for the main scrollable element
        scrollToTop();
    }
  }, [pathname, search, appliedFilters, ...extraDeps]);

  return containerRef;
};
