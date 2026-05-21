import { useMemo } from "react";
import type { Guest, GuestSortType } from "../types/guest";

interface Props {
    guests: Guest[];
    search: string;
    sort: GuestSortType;
}

export function useFilteredGuests({ guests, search, sort }: Props) {
    return useMemo(() => {
        let result = [...guests];

        if (search.trim()) {
            const query = search.toLowerCase();

            result = result.filter((guest) => {
                return [guest.full_name, guest.email, guest.phone].some((value) =>
                    value?.toLowerCase().includes(query)
                );
            });
        }

        result.sort((a, b) => {
            switch (sort) {
                case "recent": {
                    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return bTime - aTime;
                }

                case "earlier": {
                    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return aTime - bTime;
                }

                case "name-az":
                    return (a.full_name || "").localeCompare(b.full_name || "");

                case "name-za":
                    return (b.full_name || "").localeCompare(a.full_name || "");

                default:
                    return 0;
            }
        });

        return result;
    }, [guests, search, sort]);
}