import { useEffect, useState } from 'react'
import { supabase } from '@shared/services/supabase'

export function useGuestUnreadSupportCount(userId: string | null) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!userId) return

        const fetchCount = async () => {
            const { data } = await supabase
                .from('support_conversations')
                .select('unread_by_guest')
                .eq('guest_id', userId)
                .maybeSingle()
            setCount(data?.unread_by_guest ?? 0)
        }

        fetchCount()

        const channel = supabase
            .channel(`guest-unread:${userId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'support_conversations',
                filter: `guest_id=eq.${userId}`,
            }, (payload) => {
                setCount(payload.new.unread_by_guest ?? 0)
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [userId])

    return count
}