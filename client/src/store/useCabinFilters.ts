import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

export type CabinFilters = {
    price: [number, number];
    capacity: number | null;
    dateRange: {
        startDate: Date | null;
        endDate: Date | null;
    };
    bookingStatus: "all" | "upcoming" | "completed" | "cancelled";
    location_id: string | null;
    activity_id: string | null;
    offer_id: string | null;
};

export const DEFAULT_FILTERS: CabinFilters = {
    price: [50, 1000],
    capacity: null,
    dateRange: {
        startDate: null,
        endDate: null,
    },
    bookingStatus: "all",
    location_id: null,
    activity_id: null,
    offer_id: null,
};

export const serializeFiltersToParams = (filters: CabinFilters, page: number): URLSearchParams => {
    const params = new URLSearchParams();
    if (filters.price[0] !== DEFAULT_FILTERS.price[0]) params.set("min_price", String(filters.price[0]));
    if (filters.price[1] !== DEFAULT_FILTERS.price[1]) params.set("max_price", String(filters.price[1]));
    if (filters.capacity !== null) params.set("capacity", String(filters.capacity));
    if (filters.dateRange.startDate) params.set("start_date", filters.dateRange.startDate.toISOString());
    if (filters.dateRange.endDate) params.set("end_date", filters.dateRange.endDate.toISOString());
    if (filters.bookingStatus !== "all") params.set("booking_status", filters.bookingStatus);
    if (filters.location_id !== null) params.set("location_id", filters.location_id);
    if (filters.activity_id !== null) params.set("activity_id", filters.activity_id);
    if (filters.offer_id !== null) params.set("offer_id", filters.offer_id);
    if (page > 1) params.set("page", String(page));
    return params;
};

export const deserializeParamsToFilters = (params: URLSearchParams): CabinFilters => {
    const filters: CabinFilters = {
        ...DEFAULT_FILTERS,
        dateRange: { startDate: null, endDate: null }
    };
    
    const minPrice = params.get("min_price");
    const maxPrice = params.get("max_price");
    if (minPrice || maxPrice) {
        filters.price = [
            minPrice ? Number(minPrice) : DEFAULT_FILTERS.price[0],
            maxPrice ? Number(maxPrice) : DEFAULT_FILTERS.price[1],
        ];
    }
    
    const capacity = params.get("capacity");
    if (capacity) filters.capacity = Number(capacity);
    
    const startDate = params.get("start_date");
    if (startDate) filters.dateRange.startDate = new Date(startDate);
    
    const endDate = params.get("end_date");
    if (endDate) filters.dateRange.endDate = new Date(endDate);
    
    const bookingStatus = params.get("booking_status");
    if (bookingStatus) filters.bookingStatus = bookingStatus as any;
    
    const locationId = params.get("location_id");
    if (locationId) filters.location_id = locationId;
    
    const activityId = params.get("activity_id");
    if (activityId) filters.activity_id = activityId;
    
    const offerId = params.get("offer_id");
    if (offerId) filters.offer_id = offerId;
    
    return filters;
};

export const useCabinFilters = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [searchParams] = useSearchParams();

    // Derived search state
    const isSearching = useMemo(() => {
        return location.pathname.startsWith("/explorepage") || location.pathname.includes("explorepage");
    }, [location.pathname]);

    // Derived current page state
    const currentPage = useMemo(() => {
        if (!isSearching) return 1;
        
        let page = 1;
        // 1. Check path parameter: pageParam (e.g. /explorepage/page2)
        if (params.pageParam) {
            const match = params.pageParam.match(/^page(\d+)$/i) || params.pageParam.match(/^(\d+)$/);
            if (match) page = Number(match[1]);
        }
        // 2. Check path suffix: pageSuffix (e.g. /explorepage.page2)
        else if ((params as any).pageSuffix) {
            const match = (params as any).pageSuffix.match(/^\.page(\d+)$/i) || (params as any).pageSuffix.match(/^page(\d+)$/i) || (params as any).pageSuffix.match(/^\.(\d+)$/);
            if (match) page = Number(match[1]);
        }
        // 3. Fallback to query parameter page=2
        else {
            const pageQuery = searchParams.get("page");
            if (pageQuery) page = Number(pageQuery);
        }
        
        return isNaN(page) || page < 1 ? 1 : page;
    }, [isSearching, params, searchParams]);

    // Derived active filters state
    const appliedFilters = useMemo(() => {
        if (!isSearching) return DEFAULT_FILTERS;
        return deserializeParamsToFilters(searchParams);
    }, [isSearching, searchParams]);

    // Local filters state (used in sidebar controls)
    const [filters, setFilters] = useState<CabinFilters>(appliedFilters);

    // Sync local filters with URL/applied filters when URL changes
    useEffect(() => {
        setFilters(appliedFilters);
    }, [appliedFilters]);

    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const isExp = window.location.pathname.startsWith("/explorepage") || window.location.pathname.includes("explorepage");
        return isExp;
    });

    useEffect(() => {
        if (isSearching) {
            setSidebarOpen(true);
        }
    }, [isSearching]);

    const [isRefreshing, setIsRefreshing] = useState(false);

    // Active filters count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (appliedFilters.capacity !== null) count++;
        if (appliedFilters.bookingStatus !== "all") count++;
        if (appliedFilters.dateRange.startDate !== null) count++;
        if (appliedFilters.dateRange.endDate !== null) count++;
        if (appliedFilters.location_id !== null) count++;
        if (appliedFilters.activity_id !== null) count++;
        if (appliedFilters.offer_id !== null) count++;
        
        if (appliedFilters.price[0] !== DEFAULT_FILTERS.price[0] || appliedFilters.price[1] !== DEFAULT_FILTERS.price[1]) {
            count++;
        }
        return count;
    }, [appliedFilters]);

    // Auto-Open Sidebar when filters change on explore page
    const [prevAppliedJson, setPrevAppliedJson] = useState(JSON.stringify(appliedFilters));
    useEffect(() => {
        const currentJson = JSON.stringify(appliedFilters);
        if (currentJson !== prevAppliedJson) {
            setPrevAppliedJson(currentJson);
            if (activeFilterCount > 0 && isSearching) {
                setSidebarOpen(true);
            }
        }
    }, [appliedFilters, activeFilterCount, isSearching, prevAppliedJson]);

    // Actions
    const clearFilters = (silent = false) => {
        setFilters(DEFAULT_FILTERS);
        setSidebarOpen(false);
        navigate("/");
        if (!silent) {
            toast.success("Filters cleared");
        }
    };

    const applyFilters = (newFilters?: CabinFilters) => {
        const filtersToApply = newFilters || filters;
        setIsRefreshing(true);
        const tid = toast.loading(isSearching ? "Refining results..." : "Searching cabins...");
        
        // Reset page to 1 on filter apply
        const queryParams = serializeFiltersToParams(filtersToApply, 1);
        const queryStr = queryParams.toString();
        
        setTimeout(() => {
            navigate(`/explorepage${queryStr ? "?" + queryStr : ""}`);
            setIsRefreshing(false);
            toast.dismiss(tid);
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            }
        }, 400);
    };

    const setCurrentPage = (page: number) => {
        const queryParams = serializeFiltersToParams(appliedFilters, page);
        queryParams.delete("page"); // page is represented in path segment
        const queryStr = queryParams.toString();
        
        const path = page > 1 ? `/explorepage/page${page}` : `/explorepage`;
        navigate(queryStr ? `${path}?${queryStr}` : path);
    };

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    return { 
        filters, 
        appliedFilters,
        setFilters, 
        clearFilters, 
        applyFilters,
        isSearching,
        setIsSearching: (searching: boolean) => {
            if (!searching) {
                clearFilters(true);
            } else {
                navigate("/explorepage");
            }
        },
        currentPage,
        setCurrentPage,
        isRefreshing,
        sidebarOpen, 
        setSidebarOpen, 
        toggleSidebar,
        activeFilterCount 
    };
};
