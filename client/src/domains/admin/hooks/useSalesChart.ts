import { useMemo } from "react";
import type { Booking } from "@shared/types/booking";
import { toLocalDateMs } from "@shared/utils/dates";

export function useSalesChart(
    bookings: Booking[]
) {
    return useMemo(() => {
        const grouped: Record<
        string,
        number
        > = {};

    bookings.forEach((booking) => {
        const date = new Date(toLocalDateMs(booking.start_date)).toLocaleDateString();
        
    if(!grouped[date]){
        grouped[date] = 0;
    }   
    
    grouped[date] += booking.total_price;
    });

   return Object.entries(grouped).map(
      ([date, sales]) => ({
        date,
        sales,
      })
    );
  }, [bookings]);
}
