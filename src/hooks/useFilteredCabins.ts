import { useMemo } from "react";
import type { Cabin } from "../types/cabin";

export function useFilteredCabins(
  cabins: Cabin[],
  filter: string,
  sort: string
) {
    return useMemo(() => {
        let result = [...cabins];

        // FILTER
        if (filter === "with-discount") {
      result = result.filter((c) => c.discount > 0);
    }

    if (filter === "no-discount") {
      result = result.filter((c) => c.discount === 0);
    }

    //sort
    result.sort((a,b) => {
        switch (sort) {
        case "recent":
          // Keep the query order (newest first) as the default recent sort.
          return 0;

            case "price-high":
                return b.price_per_night - a.price_per_night;

            case "price-low":
                return a.price_per_night - b.price_per_night;
                
            case "capacity-high":
               return b.capacity - a.capacity;

            case "capacity-low":
               return a.capacity - b.capacity;

        default:
          return 0;    
        }
    });
    
    return result;
    }, [cabins, filter, sort]);
    }
