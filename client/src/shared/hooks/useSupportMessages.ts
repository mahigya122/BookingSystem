import { useEffect, useRef, useState } from 'react'
import { supabase } from '@shared/services/supabase'
import type { SupportMessage, SenderRole } from '@shared/types/support.types'

export function useSupportMessages(conversationId: string | null, senderRole: SenderRole, isActive: boolean = true) {
    const [messages, setMessages] = useState<SupportMessage[]>([])
    const bottomRef = useRef<HTMLDivElement>(null)
    const prevConversationIdRef = useRef<string | null>(null)

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
        if (isActive) {
            supabase.rpc('reset_unread', {
                p_conversation_id: conversationId,
                p_role: senderRole,
            }).then(({ error }) => {
                if (error) console.error('reset_unread failed:', error)
            })
        }

        // Realtime: new messages
        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'support_messages',
                filter: `conversation_id=eq.${conversationId}`,
            }, (payload) => {
                const incoming = payload.new as SupportMessage
                setMessages(prev => {
                    if (prev.find(m => m.id === incoming.id)) return prev
                    return [...prev, incoming]
                })

                // Mark as read immediately since conversation is open
                if (isActive) {
                    supabase.rpc('reset_unread', {
                        p_conversation_id: conversationId,
                        p_role: senderRole,
                    }).then(({ error }) => {
                        if (error) console.error('reset_unread failed:', error)
                    })
                }
            })

            // Realtime: read receipt updates (delivered_at / seen_at changes)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'support_messages',
                filter: `conversation_id=eq.${conversationId}`,
            }, (payload) => {
                const updated = payload.new as SupportMessage
                setMessages(prev =>
                    prev.map(m => m.id === updated.id
                        ? { ...m, is_read: updated.is_read, delivered_at: updated.delivered_at, seen_at: updated.seen_at }
                        : m
                    )
                )
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [conversationId, senderRole, isActive])

    // Auto scroll — instant on conversation switch, smooth on new messages
    useEffect(() => {
        const isNewConversation = prevConversationIdRef.current !== conversationId
        prevConversationIdRef.current = conversationId

        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({
                behavior: isNewConversation ? 'auto' : 'smooth',
                block: 'end',
            })
        })
    }, [messages, conversationId])

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