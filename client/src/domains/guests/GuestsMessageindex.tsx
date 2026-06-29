import { useEffect, useState } from 'react'
import { useSupportMessages } from '@shared/hooks/useSupportMessages'
import { useOnlinePresence, useWatchPresence, useTyping, formatLastSeen } from '@shared/hooks/usePresence'
import { supabase } from '@shared/services/supabase'
import { useUser } from '@shared/hooks'

//Tick icon component
function Ticks({ isRead }: { isRead: boolean }) {
  return (
    <span className={`inline-flex items-center ml-1 ${isRead ? 'text-blue-300' : 'text-sky-200'}`}>
      {isRead ? (
        // Double blue tick
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 5l3 3 5-7"       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 5l3 3 5-7"       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        // Single grey tick
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 5l3 3 5-7"       stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </span>
  )
}

//Typing dots
function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  )
}

//Main component
export default function GuestMessages() {
  const { user } = useUser()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [adminId,        setAdminId]        = useState<string | null>(null)
  const [input,          setInput]          = useState('')

  const { messages, sendMessage, bottomRef } = useSupportMessages(conversationId, 'guest')

  // My presence (marks me online)
  useOnlinePresence()

  // Watch admin's presence
  const { isOnline, lastSeenAt } = useWatchPresence(adminId)

  // Typing
  const { otherIsTyping, setTyping } = useTyping(conversationId, user?.id ?? null)

  // Find or create conversation + get admin id
  useEffect(() => {
    if (!user) return

    const init = async () => {
      // Get conversation
      const { data: existing } = await supabase
        .from('support_conversations')
        .select('id')
        .eq('guest_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single()

      if (existing) {
        setConversationId(existing.id)
      } else {
        const { data: created } = await supabase
          .from('support_conversations')
          .insert({ guest_id: user.id, subject: 'Direct Message' })
          .select('id')
          .single()
        if (created) setConversationId(created.id)
      }

      // Get admin user id to watch their presence
      const { data: admin } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .limit(1)
        .single()
      if (admin) setAdminId(admin.id)
    }

    init()
  }, [user])

  const handleSend = async () => {
    if (!input.trim() || !user) return
    setTyping(false)
    await sendMessage(input, user.id)
    setInput('')
  }

  const handleTyping = (val: string) => {
    setInput(val)
    setTyping(val.length > 0)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 py-3 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          {/* Online dot */}
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
            isOnline ? 'bg-green-500' : 'bg-slate-300'
          }`} />
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-white">Support</p>
          <p className="text-xs text-slate-400">
            {isOnline ? (
              <span className="text-green-500 font-medium">Online</span>
            ) : (
              formatLastSeen(lastSeenAt)
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        {messages.length === 0 && (
          <div className="flex justify-center pt-8">
            <p className="text-xs text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
              Send a message to start the conversation
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.sender_role === 'guest'
          const nextMsg = messages[i + 1]
          // Show avatar only on last message in a group
          const isLastInGroup = !nextMsg || nextMsg.sender_role !== msg.sender_role

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'bg-sky-500 text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
                {/* Timestamp + ticks — only on last message in group */}
                {isLastInGroup && (
                  <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <Ticks isRead={msg.is_read} />}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {otherIsTyping && <TypingDots />}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          onBlur={() => setTyping(false)}
          placeholder="Message support..."
          className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}