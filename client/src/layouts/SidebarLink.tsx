import { NavLink } from "react-router-dom";
import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { fetchJson } from "@shared/services/http";
import { getLocations } from "@shared/services/locationsApi";
import { getOffers } from "@shared/services/offersApi";
import { getActivities } from "@shared/services/activitiesApi";
import { getReviews } from "@shared/services/reviewsApi";
import { supabase } from "@shared/services/supabase";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  open?: boolean;
  badge?: number;
}

const SidebarLink = ({ to, icon, label, end = false, open, badge }: SidebarLinkProps) => {
  const queryClient = useQueryClient();

  const handlePrefetch = () => {
    if (to === "/bookings") {
      queryClient.prefetchQuery({
        queryKey: ["bookings", 1, 10, "all", "recent", "", "all"],
        queryFn: () => fetchJson("/bookings?filter=all&sort=recent&search=&paymentStatus=all&page=1&pageSize=10"),
      });
    } else if (to === "/cabins") {
      queryClient.prefetchQuery({
        queryKey: ["cabins", 1, 10, "all", "recent"],
        queryFn: () => fetchJson("/cabins?filter=all&sort=recent&page=1&pageSize=10"),
      });
    } else if (to === "/guests") {
      queryClient.prefetchQuery({
        queryKey: ["guests", 1, 15, "", "recent"],
        queryFn: async () => {
          const query = supabase
            .from("guests")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(0, 14);
          const { data: list, count, error: err } = await query;
          if (err) throw err;
          return { guests: list ?? [], count: count ?? 0 };
        },
      });
    } else if (to === "/locations") {
      queryClient.prefetchQuery({
        queryKey: ["locations", 1, 10, "", "name-az"],
        queryFn: () => getLocations("/locations?page=1&pageSize=10&search=&sort=name-az"),
      });
    } else if (to === "/offers") {
      queryClient.prefetchQuery({
        queryKey: ["offers", 1, 10, ""],
        queryFn: () => getOffers("/offers?page=1&pageSize=10&search="),
      });
    } else if (to === "/activities") {
      queryClient.prefetchQuery({
        queryKey: ["activities", 1, 10, ""],
        queryFn: () => getActivities("/activities?page=1&pageSize=10&search="),
      });
    } else if (to === "/reviews") {
      queryClient.prefetchQuery({
        queryKey: ["reviews", { approved: undefined, page: 1, pageSize: 6 }],
        queryFn: () => getReviews(undefined, 1, 6),
      });
    }
  };

  return (
    <NavLink
      to={to}
      end={end}
      className="block no-underline relative group/link"
    >
      {({ isActive }) => (
        <>
          {/* Active Indicator (Vertical line anchored to left of sidebar nav) */}
          <div
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-sky-500 rounded-r-full transition-all duration-300 z-20
              ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
            `}
          />
          <div
            onMouseEnter={handlePrefetch}
            className={`
              flex items-center transition-all duration-300 group
              ${open 
                ? "gap-2.5 px-3 py-2 rounded-xl mx-2 justify-start" 
                : "w-10 h-10 rounded-xl justify-center mx-auto"
              }
              ${isActive
                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }
            `}
          >
            <div className={`flex-shrink-0 relative transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
              {icon}
              {/* Collapsed-sidebar badge: small dot on the icon */}
              {!open && !!badge && badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </div>
            
            {open && (
              <span className="text-sm tracking-tight whitespace-nowrap overflow-hidden flex items-center gap-2">
                {label}
                {/* Expanded-sidebar badge: pill next to the label */}
                {!!badge && badge > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1.5 flex items-center justify-center">
                    {badge > 9 ? "9+" : badge}
                  </span>
                )}
              </span>
            )}
          </div>
        </>
      )}
    </NavLink>
  );
};

export default SidebarLink;
