export type SenderRole = 'guest' | 'admin'
export type ConversationStatus = 'open' | 'resolved' | 'closed'

export interface SupportConversation {
    id: string
    guest_id: string
    subject: string
    status: ConversationStatus
    last_message_preview: string | null
    last_message_at: string
    unread_by_admin: number
    unread_by_guest: number
    created_at: string
    guest?: {
        id: string
        full_name: string
        email: string
    }
}

export interface SupportMessage {
    id: string
    conversation_id: string
    sender_id: string
    sender_role: SenderRole
    content: string
    is_read: boolean
    created_at: string
    sender?: {
        id: string
        full_name: string
    }
}