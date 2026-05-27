import { useMemo, useState } from "react";

export function useDashboardRange() {
    const [range, setRange] = useState(7);

    const today = useMemo(() => new Date(), []);

    const rangeEnd = useMemo(() => {
        const d = new Date(today);
        d.setHours(23, 59, 59, 999);
        return d;
    }, [today]);

    const rangeStart = useMemo(() => {
        const d = new Date(today);

        d.setDate(d.getDate() - (range - 1));
        d.setHours(0, 0, 0, 0);
        return d;
    }, [today, range]);

    return {
    range,
    setRange,
    rangeStart,
    rangeEnd,
    };
}