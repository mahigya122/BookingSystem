import { useMemo } from "react";
import { useCabinsData } from "../domains/cabins/hooks/useCabinsData";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";
import { useUser } from "@shared/auth_hooks";
import { useLocations } from "@shared/hooks/useLocations";
import { useOffers } from "@shared/hooks/useOffers";
import { useActivities } from "@shared/hooks/useActivities";

export const useExplore = () => {
  const { cabins = [], isLoading: isCabinsLoading } = useCabinsData();
  const { appliedFilters: filters } = useCabinFiltersContext();
  const { user } = useUser();

  // Fetch reference data to resolve names from IDs for robust matching across duplicated records
  const { locations = [] } = useLocations();
  const { offers = [] } = useOffers();
  const { activities = [] } = useActivities();

  const filteredCabins = useMemo(() => {
    const normalize = (s?: string) => s?.toLowerCase().trim() || "";

    // Resolve selected names from IDs
    const selectedLocation = locations.find(l => l.id === filters?.location_id);
    const selectedOffer = offers.find(o => o.id === filters?.offer_id);
    const selectedActivity = activities.find(a => a.id === filters?.activity_id);

    const selectedLocName = normalize(selectedLocation?.name);
    const selectedOfferTitle = normalize(selectedOffer?.title || (selectedOffer as any)?.name);
    const selectedActName = normalize(selectedActivity?.name);

    return cabins
      .map((cabin) => {
        const bookingsInRange = (cabin.bookings || []).filter((booking) => {
          if (booking.status === "cancelled") return false;
          if (!filters?.dateRange?.startDate || !filters?.dateRange?.endDate) return false;

          const bookingStart = new Date(booking.start_date);
          const bookingEnd = new Date(booking.end_date);
          const selStart = new Date(filters.dateRange.startDate);
          const selEnd = new Date(filters.dateRange.endDate);

          return selStart < bookingEnd && selEnd > bookingStart;
        });

        const isBookedByUser = user ? bookingsInRange.some((b) => b.guest_id === user.id) : false;
        const isBookedByOthers = user ? bookingsInRange.some((b) => b.guest_id !== user.id) : bookingsInRange.length > 0;

        return {
          ...cabin,
          isBookedByUser,
          isBookedByOthers,
          isBooked: bookingsInRange.length > 0,
          bookingCount: (cabin.bookings || []).length,
        };
      })
      .filter((cabin) => {
        const cabinPrice = Number(cabin.price_per_night);
        
        // Defensive price check
        const minPrice = filters?.price?.[0] ?? 0;
        const maxPrice = filters?.price?.[1] ?? 1000000;

        const withinPrice =
          cabinPrice >= minPrice &&
          cabinPrice <= maxPrice;

        const withinCapacity =
          filters?.capacity ? cabin.capacity >= filters.capacity : true;

        const matchesLocation =
          !selectedLocation ? true : (cabin.location_id === selectedLocation.id || normalize(cabin.location?.name) === selectedLocName);

        const matchesOffer =
          !selectedOffer ? true : cabin.offers?.some((o) => 
            o.id === selectedOffer.id || normalize(o.title || (o as any).name) === selectedOfferTitle
          );

        const matchesActivity =
          !selectedActivity ? true : cabin.activities?.some((a) => 
            a.id === selectedActivity.id || normalize(a.name) === selectedActName
          );

        return withinPrice && withinCapacity && matchesLocation && matchesActivity && matchesOffer;
      });
  }, [cabins, filters, user, locations, offers, activities]);

  return {
    cabins: filteredCabins,
    isLoading: isCabinsLoading,
    totalCount: cabins.length,
    filteredCount: filteredCabins.length,
  };
};
