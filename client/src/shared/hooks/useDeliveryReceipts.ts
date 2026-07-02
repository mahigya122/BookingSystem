import { useEffect } from 'react'
import { supabase } from '@shared/services/supabase'
import type { SenderRole } from '@shared/types/support.types'

/**
 * Marks incoming messages "delivered" the instant this client receives
 * them via realtime — regardless of which conversation is currently open.
 * Mount once at the page level (AdminMessages / GuestMessages), not inside
 * useSupportMessages, since that hook only runs for the active conversation.
 */
export function useDeliveryReceipts(role: SenderRole, userId: string | null) {
    useEffect(() => {
        if (!userId) return

        const channel = supabase
            .channel(`delivery:${role}:${userId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'support_messages',
            }, (payload) => {
                const msg = payload.new as { id: string; sender_role: SenderRole }
                if (msg.sender_role === role) return // don't mark my own messages
                supabase.rpc('mark_delivered', { p_message_ids: [msg.id] })
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [role, userId])
}