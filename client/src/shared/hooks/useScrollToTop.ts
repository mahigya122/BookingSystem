import { useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import { CabinFiltersContext } from "../../domains/cabins/contexts/CabinFiltersContext";

/**
 * Utility to find and scroll the main page elements or actual scrollable containers to the top
 */
export const scrollToTop = (element?: HTMLElement | null, behavior: ScrollBehavior = "smooth") => {
  let scrolled = false;
  
  // If an element is passed and is scrollable, scroll it
  if (element && element.scrollHeight > element.clientHeight) {
    element.scrollTo({ top: 0, behavior });
    scrolled = true;
  }
  
  // If no element was scrolled (or none was passed), scroll the main page elements
  if (!scrolled) {
    window.scrollTo({ top: 0, behavior });
    document.documentElement.scrollTo({ top: 0, behavior });
    document.body.scrollTo({ top: 0, behavior });
    
    // Fallback: search for any actual scrollable container in the viewport and scroll it
    const scrollables = document.querySelectorAll("main, .overflow-y-auto, [class*='overflow-y-']");
    scrollables.forEach((el) => {
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTo({ top: 0, behavior });
      }
    });
  }
};

/**
 * Hook to scroll a container or the page to top on navigation or filter changes
 * @param extraDeps Optional extra dependencies to trigger a scroll to top (e.g. pagination)
 */
export const useScrollToTop = (extraDeps: any[] = []) => {
  const { pathname, search } = useLocation();
  const context = useContext(CabinFiltersContext);
  const appliedFilters = context?.appliedFilters ?? null;

  const containerRef = useRef<HTMLElement | HTMLDivElement>(null);

  useEffect(() => {
    // Scroll layout container or page viewport to top
    scrollToTop(containerRef.current, "auto");
  }, [pathname, search, appliedFilters, ...extraDeps]);

  return containerRef;
};

