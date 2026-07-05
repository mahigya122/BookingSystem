import { useEffect, useState } from 'react'
import { supabase } from '@shared/services/supabase'

export function useGuestUnreadSupportCount(userId: string | null) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!userId) return

        const topic = `guest-unread:${userId}`

        // Defensive: if a channel with this exact topic already exists
        // (e.g. from a fast remount that hasn't finished cleanup yet),
        // remove it first — otherwise supabase.channel() returns the
        // already-subscribed instance and .on() throws.
        const existing = supabase.getChannels().find(
            (ch) => ch.topic === `realtime:${topic}`
        )
        if (existing) {
            supabase.removeChannel(existing)
        }

        const fetchCount = async () => {
            const { data, error } = await supabase
                .from('support_conversations')
                .select('unread_by_guest')
                .eq('guest_id', userId)

            if (error) {
                console.error('unread count fetch failed:', error)
                return
            }

            const total = (data ?? []).reduce(
                (sum, row) => sum + (row.unread_by_guest ?? 0),
                0
            )
            setCount(total)
        }

        fetchCount()

        const channel = supabase
            .channel(topic)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'support_conversations',
            }, (payload) => {
                console.log('Realtime update received in useGuestUnreadSupportCount:', payload)
                fetchCount()
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [userId])

    return count
}