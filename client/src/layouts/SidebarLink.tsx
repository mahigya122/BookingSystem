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
}

const SidebarLink = ({ to, icon, label, end = false, open }: SidebarLinkProps) => {
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
      className="block no-underline"
    >
      {({ isActive }) => (
        <div
          onMouseEnter={handlePrefetch}
          className={`
            flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative
            ${isActive
              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
            }
          `}
        >
          {/* Active Indicator (Vertical line) */}
          <div
            className={`
              absolute left-0 w-1 h-6 bg-sky-500 rounded-r-full transition-all duration-300
              ${isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"}
            `}
          />

          <div className={`flex-shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
            {icon}
          </div>
          
          <span className={`text-sm tracking-tight whitespace-nowrap overflow-hidden ${open ? "block" : "block lg:hidden"}`}>
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
};

export default SidebarLink;
