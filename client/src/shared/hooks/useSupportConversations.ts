import { useEffect, useState } from 'react'
import { supabase } from '@shared/services/supabase'
import type { SupportConversation, ConversationStatus } from '@shared/types/support.types'

export function useSupportConversations(role: 'guest' | 'admin', userId: string | null) {
    const [conversations, setConversations] = useState<SupportConversation[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!userId) return

        const fetchConversations = async () => {
            setLoading(true)

            let query = supabase
                .from('support_conversations')
                .select(`
          *,
          guest:profiles!guest_id(id, full_name, email)
        `)
                .order('last_message_at', { ascending: false })

            if (role === 'guest') {
                query = query.eq('guest_id', userId)
            }

            const { data, error } = await query
            if (!error && data) setConversations(data as SupportConversation[])
            setLoading(false)
        }

        fetchConversations()

        // Realtime: update conversation list when last_message or unread changes
        const channel = supabase
            .channel(`conversations:${role}:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'support_conversations',
                },
                () => {
                    // Re-fetch on any change to keep list sorted and unread counts fresh
                    fetchConversations()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [role, userId])

    const startConversation = async (subject: string, guestId: string) => {
        const { data, error } = await supabase
            .from('support_conversations')
            .insert({ guest_id: guestId, subject })
            .select()
            .single()

        if (error) {
            console.error('Start conversation error:', error)
            return null
        }
        return data as SupportConversation
    }

    const updateStatus = async (conversationId: string, status: ConversationStatus) => {
        await supabase
            .from('support_conversations')
            .update({ status })
            .eq('id', conversationId)
    }

    return { conversations, loading, startConversation, updateStatus }
}