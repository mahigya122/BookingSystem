import { useEffect, useRef, useState } from "react";
import { useSupportMessages } from "@shared/hooks/useSupportMessages";
import { useSupportConversations } from "@shared/hooks/useSupportConversations";
import { useDeliveryReceipts } from "@shared/hooks/useDeliveryReceipts";
import {
  useOnlinePresence,
  useWatchPresence,
  useTyping,
  formatLastSeen,
} from "@shared/hooks/usePresence";
import { useAuthUser } from "@shared/hooks/auth/useAuthUser";
import {
  getTickStatus,
  MessageTicks,
} from "@shared/components/support/MessageTicks";
import type { SupportConversation } from "@shared/types/support.types";
import { isSameDay, formatDateDivider } from "@shared/utils/chatDate";

function TypingDots() {
  return (
    <div className="flex justify-start pl-9">
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const { user } = useAuthUser();
  const [activeConv, setActiveConv] = useState<SupportConversation | null>(
    null,
  );
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { conversations } = useSupportConversations("admin", user?.id ?? null);
  const { messages, sendMessage, bottomRef } = useSupportMessages(
    activeConv?.id ?? null,
    "admin",
  );

  useOnlinePresence();
  useDeliveryReceipts("admin", user?.id ?? null);

  const { isOnline, lastSeenAt } = useWatchPresence(
    activeConv?.guest_id ?? null,
  );

  const { otherIsTyping, setTyping } = useTyping(
    activeConv?.id ?? null,
    user?.id ?? null,
  );

  useEffect(() => {
    if (activeConv?.id) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeConv?.id, bottomRef]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    setTyping(false);
    await sendMessage(input, user.id);
    setInput("");
  };

  const handleTyping = (val: string) => {
    setInput(val);
    setTyping(val.length > 0);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (val.length > 0) {
      typingTimeoutRef.current = setTimeout(() => setTyping(false), 3000);
    }
  };

  const lastSeenOwnMessageId = messages.reduce<string | null>(
    (acc, m) => (m.sender_role === "admin" && m.seen_at ? m.id : acc),
    null,
  );

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/10">
      {/* Sidebar */}
      <div className="w-80 bg-slate-50/90 dark:bg-slate-900/60 border-r border-slate-200/60 dark:border-slate-800/80 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="font-extrabold text-slate-800 dark:text-white text-xs tracking-wider uppercase">
              Support Inbox
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
              {conversations.length} active threads
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-xs text-slate-400 text-center mt-10">
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => {
            const isActive = activeConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  setActiveConv(conv);
                  setInput("");
                }}
                className={`w-full text-left px-3 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 border ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 border-transparent text-slate-900 dark:text-white font-semibold"
                    : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  isActive 
                    ? "bg-gradient-to-tr from-sky-400 to-blue-600 text-white" 
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                }`}>
                  {conv.guest?.full_name?.[0]?.toUpperCase() ?? "G"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold truncate ${isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                      {conv.guest?.full_name ?? "Guest"}
                    </p>
                    {conv.unread_by_admin > 0 && (
                      <span className="ml-2 bg-sky-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                        {conv.unread_by_admin}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {conv.last_message_preview ?? "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-h-0 bg-transparent relative">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-150 dark:border-slate-800 px-6 py-4 flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-sky-500/10">
                  {activeConv.guest?.full_name?.[0]?.toUpperCase() ?? "G"}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                    isOnline ? "bg-emerald-500" : "bg-slate-300"
                  }`}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-0.5">
                  Guest
                </span>
                <span className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">
                  {activeConv.guest?.full_name ?? "Guest"}
                </span>
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  {otherIsTyping ? (
                    <span className="text-emerald-500">typing...</span>
                  ) : isOnline ? (
                    <span className="text-emerald-500">Online</span>
                  ) : (
                    formatLastSeen(lastSeenAt)
                  )}
                </span>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-1.5 relative z-10 scroll-smooth">
              {messages.length === 0 && (
                <div className="flex justify-center pt-8">
                  <p className="text-xs text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-750">
                    No messages yet
                  </p>
                </div>
              )}

              {messages.map((msg, i) => {
                const isMe = msg.sender_role === "admin";
                const nextMsg = messages[i + 1];
                const isLastInGroup = !nextMsg || nextMsg.sender_role !== msg.sender_role;
                const showSeenAvatar = isMe && msg.id === lastSeenOwnMessageId;
                const showDateDivider = i === 0 || !isSameDay(messages[i - 1].created_at, msg.created_at);

                return (
                  <div key={msg.id} className="space-y-1">
                    {showDateDivider && (
                      <div className="flex justify-center my-4">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                          {formatDateDivider(msg.created_at)}
                        </span>
                      </div>
                    )}

                    <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                      {!isMe && (
                        <div className={isLastInGroup ? "opacity-100" : "opacity-0"}>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {activeConv.guest?.full_name?.[0]?.toUpperCase() ?? "G"}
                          </div>
                        </div>
                      )}

                      <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? "bg-sky-500 text-white rounded-br-sm"
                            : "bg-emerald-100 text-emerald-950 rounded-bl-sm dark:bg-emerald-900/40 dark:text-emerald-50"
                        }`}>
                          {msg.content}
                        </div>
                        {isLastInGroup && (
                          <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {isMe && <MessageTicks status={getTickStatus(msg)} />}
                          </div>
                        )}
                      </div>

                      {isMe && (
                        <div className={isLastInGroup ? "opacity-100" : "opacity-0"}>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            A
                          </div>
                        </div>
                      )}
                    </div>

                    {showSeenAvatar && (
                      <div className="flex justify-end pr-9 mt-0.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-white text-[8px] font-bold">
                          {activeConv.guest?.full_name?.[0]?.toUpperCase() ?? "G"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {otherIsTyping && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* Input - Standard footer to match guest support chat */}
            <div className="p-4 shrink-0">
              <div className="rounded-[2rem] border border-emerald-100 dark:border-emerald-800/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-2 shadow-lg shadow-emerald-500/10 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSend()
                  }
                  onBlur={() => setTyping(false)}
                  placeholder={`Reply to ${activeConv.guest?.full_name ?? "guest"}...`}
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shrink-0"
                >
                  →
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-slate-50/20 dark:bg-slate-950/20 relative z-10">
            <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-tr from-sky-400/10 to-indigo-500/10 border border-sky-100/30 flex items-center justify-center text-3xl shadow-sm">
              💬
            </div>
            <p className="text-sm font-black text-slate-800 dark:text-white">
              Select a conversation
            </p>
            <p className="text-xs text-slate-400 max-w-[220px] text-center leading-relaxed">
              Choose a guest from the support inbox on the left to start replying
            </p>
          </div>
        )}
      </div>
    </div>
  );
}