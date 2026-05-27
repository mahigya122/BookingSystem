import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../../src/services/apiSettings";
import type { Settings } from "../../../shared/types/settings";

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