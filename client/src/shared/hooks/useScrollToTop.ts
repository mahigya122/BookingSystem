import { useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { CabinFiltersContext } from "../../domains/cabins/contexts/CabinFiltersContext";

/**
 * Utility to find the nearest scrollable parent and scroll it to top
 */
export const scrollToTop = (element?: HTMLElement | null, behavior: ScrollBehavior = "smooth") => {
  const scrollable = element || document.querySelector("main") || document.querySelector(".overflow-y-auto") || window;
  scrollable.scrollTo({ top: 0, behavior });
};

/**
 * Hook to scroll a container to top on navigation or filter changes
 * @param extraDeps Optional extra dependencies to trigger a scroll to top (e.g. pagination)
 */
export const useScrollToTop = (extraDeps: any[] = []) => {
  const { pathname, search } = useLocation();
  const context = useContext(CabinFiltersContext);
  const appliedFilters = context?.appliedFilters ?? null;

  const containerRef = useRef<HTMLElement | HTMLDivElement>(null);

  useEffect(() => {
    // For navigation, we use "auto" (instant) to avoid seeing the jump
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
    } else {
        // Fallback to searching for the main scrollable element
        scrollToTop(null, "auto");
    }
  }, [pathname, search, appliedFilters, ...extraDeps]);

  return containerRef;
};
