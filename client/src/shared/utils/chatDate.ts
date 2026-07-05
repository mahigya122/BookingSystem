export function isSameDay(a: string, b: string): boolean {
    return new Date(a).toDateString() === new Date(b).toDateString()
}

export function formatDateDivider(dateStr: string): string {
    const d = new Date(dateStr)
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)

    if (d.toDateString() === now.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString([], {
        month: 'long',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
}