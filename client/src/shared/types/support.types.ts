export type SenderRole = 'guest' | 'admin'
export type ConversationStatus = 'open' | 'resolved' | 'closed'
export type TickStatus = 'sent' | 'delivered' | 'seen'
export type AttachmentType = 'image' | 'video'

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
    content: string | null
    is_read: boolean
    delivered_at: string | null
    seen_at: string | null
    created_at: string
    attachment_url: string | null
    attachment_type: AttachmentType | null
    attachment_name: string | null
    attachment_size: number | null
    thumbnail_url: string | null
    sender?: {
        id: string
        full_name: string
    }
}

// Local-only shape used while an attachment is picked but not yet sent
export interface PendingAttachment {
    file: File
    previewUrl: string // local object URL for instant preview
    type: AttachmentType
}
