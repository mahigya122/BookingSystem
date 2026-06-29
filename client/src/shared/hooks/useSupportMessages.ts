import { useEffect, useRef, useState } from 'react'
import { supabase } from '@shared/services/supabase'
import type { SupportMessage, SenderRole } from '@shared/types/support.types'

export function useSupportMessages(conversationId: string | null, senderRole: SenderRole) {
    const [messages, setMessages] = useState<SupportMessage[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!conversationId) return

        // Fetch existing messages
        supabase
            .from('support_messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true })
            .then(({ data }) => { if (data) setMessages(data as SupportMessage[]) })

        // Mark as read when opened
        supabase.rpc('reset_unread', {
            p_conversation_id: conversationId,
            p_role: senderRole,
        })

        // Realtime: new messages
        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'support_messages',
                filter: `conversation_id=eq.${conversationId}`,
            }, (payload) => {
                setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev
                    return [...prev, payload.new as SupportMessage]
                })

                // Mark as read immediately since conversation is open
                supabase.rpc('reset_unread', {
                    p_conversation_id: conversationId,
                    p_role: senderRole,
                })
            })

            // Realtime: read receipt updates (is_read flips to true)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'support_messages',
                filter: `conversation_id=eq.${conversationId}`,
            }, (payload) => {
                setMessages(prev =>
                    prev.map(m => m.id === payload.new.id ? { ...m, is_read: payload.new.is_read } : m)
                )
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [conversationId, senderRole])

    // Auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async (content: string, senderId: string) => {
        if (!conversationId || !content.trim()) return
        await supabase.from('support_messages').insert({
            conversation_id: conversationId,
            sender_id: senderId,
            sender_role: senderRole,
            content: content.trim(),
        })
    }

    return { messages, sendMessage, bottomRef }
}