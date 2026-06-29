import { useEffect, useState } from 'react'
import { supabase } from '@shared/services/supabase'

// Online / Last seen
export function useOnlinePresence() {
    useEffect(() => {
        // Set online on mount
        supabase.rpc('update_user_presence', { p_online: true })

        const handleFocus = () => supabase.rpc('update_user_presence', { p_online: true })
        const handleBlur = () => supabase.rpc('update_user_presence', { p_online: false })

        window.addEventListener('focus', handleFocus)
        window.addEventListener('blur', handleBlur)

        return () => {
            supabase.rpc('update_user_presence', { p_online: false })
            window.removeEventListener('focus', handleFocus)
            window.removeEventListener('blur', handleBlur)
        }
    }, [])
}

// Watch another user's online status 
export function useWatchPresence(userId: string | null) {
    const [isOnline, setIsOnline] = useState(false)
    const [lastSeenAt, setLastSeenAt] = useState<string | null>(null)

    useEffect(() => {
        if (!userId) return

        // Initial fetch
        supabase
            .from('profiles')
            .select('is_online, last_seen_at')
            .eq('id', userId)
            .single()
            .then(({ data }) => {
                if (data) {
                    setIsOnline(data.is_online ?? false)
                    setLastSeenAt(data.last_seen_at)
                }
            })

        // Realtime updates
        const channel = supabase
            .channel(`presence:${userId}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'profiles',
                filter: `id=eq.${userId}`,
            }, (payload) => {
                setIsOnline(payload.new.is_online ?? false)
                setLastSeenAt(payload.new.last_seen_at)
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [userId])

    return { isOnline, lastSeenAt }
}

// Typing indicator
export function useTyping(conversationId: string | null, myUserId: string | null) {
    const [otherIsTyping, setOtherIsTyping] = useState(false)

    useEffect(() => {
        if (!conversationId || !myUserId) return

        const channel = supabase.channel(`typing:${conversationId}`, {
            config: { presence: { key: myUserId } }
        })

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState<{ typing: boolean }>()
                // Check if anyone OTHER than me is typing
                const othersTyping = Object.entries(state)
                    .filter(([key]) => key !== myUserId)
                    .some(([, presences]) => presences.some(p => p.typing))
                setOtherIsTyping(othersTyping)
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [conversationId, myUserId])

    // Call this from the input box
    const setTyping = (typing: boolean) => {
        if (!conversationId || !myUserId) return
        const channel = supabase.channel(`typing:${conversationId}`, {
            config: { presence: { key: myUserId } }
        })
        channel.track({ typing })
    }

    return { otherIsTyping, setTyping }
}

// Format last seen
export function formatLastSeen(lastSeenAt: string | null): string {
    if (!lastSeenAt) return 'last seen recently'
    const diff = Date.now() - new Date(lastSeenAt).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (mins < 1) return 'last seen just now'
    if (mins < 60) return `last seen ${mins}m ago`
    if (hours < 24) return `last seen ${hours}h ago`
    if (days === 1) return 'last seen yesterday'
    return `last seen ${days} days ago`
}