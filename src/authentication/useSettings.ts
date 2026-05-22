import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../services/apiSettings";
import type { Settings } from "../types/settings";

export function useSettings() {
    const {
        data: settings,
        isLoading,
        error,
    } = useQuery<Settings>({
        queryKey: ["settings"],
        queryFn: getSettings,
    });

    return {
        settings,
        isLoading,
        error,
    };
}