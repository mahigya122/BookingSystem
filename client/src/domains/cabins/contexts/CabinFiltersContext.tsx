/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useCabinFilters } from "../../../store/useCabinFilters";

// Use ReturnType to ensure the context is always in sync with the hook
type CabinFiltersContextType = ReturnType<typeof useCabinFilters>;

const CabinFiltersContext = createContext<CabinFiltersContextType | undefined>(undefined);

export const CabinFiltersProvider = ({ children }: { children: ReactNode }) => {
    const value = useCabinFilters();

    return (
        <CabinFiltersContext.Provider value={value}>
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
