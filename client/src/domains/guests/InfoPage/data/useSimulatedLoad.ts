import { useEffect, useState } from "react";

/**
 * Static info pages have no real fetch, but the app's convention is that
 * every content section shows a skeleton while it resolves (see
 * SpecialOffers' useOffers().isLoading). This gives info/blog pages the
 * same feel on first paint instead of popping in instantly, and doubles
 * as the seam to swap in a real fetch (e.g. blog posts from Supabase)
 * later without touching the page component's structure.
 */
export const useSimulatedLoad = (delay = 400) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return isLoading;
};
