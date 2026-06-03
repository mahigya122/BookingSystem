import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useCabinFilters, type CabinFilters } from "../../../store/useCabinFilters";

interface CabinFiltersContextType {
    filters: CabinFilters;
    setFilters: (filters: CabinFilters) => void;
    clearFilters: () => void;
}

const CabinFiltersContext = createContext<CabinFiltersContextType | undefined>(undefined);

export const CabinFiltersProvider = ({ children }: { children: ReactNode }) => {
    const filterState = useCabinFilters();

    return (
        <CabinFiltersContext.Provider value={filterState}>
            {children}
        </CabinFiltersContext.Provider>
    );
};

export const useCabinFiltersContext = () => {
    const context = useContext(CabinFiltersContext);
    if (!context) {
        throw new Error("useCabinFiltersContext must be used within a CabinFiltersProvider");
    }
    return context;
};
