import { useState } from "react";
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

  const { conversations } = useSupportConversations("admin", user?.id ?? null);
  const { messages, sendMessage, bottomRef } = useSupportMessages(
    activeConv?.id ?? null,
    "admin",
  );

  // My presence
  useOnlinePresence();

  // Marks incoming messages "delivered" for ANY conversation, not just the open one
  useDeliveryReceipts("admin", user?.id ?? null);

  // Watch guest's presence
  const { isOnline, lastSeenAt } = useWatchPresence(
    activeConv?.guest_id ?? null,
  );

  // Typing
  const { otherIsTyping, setTyping } = useTyping(
    activeConv?.id ?? null,
    user?.id ?? null,
  );

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    setTyping(false);
    await sendMessage(input, user.id);
    setInput("");
  };

  const handleTyping = (val: string) => {
    setInput(val);
    setTyping(val.length > 0);
  };

  // Last message I (admin) sent that the guest has already seen
  const lastSeenOwnMessageId = messages.reduce<string | null>(
    (acc, m) => (m.sender_role === "admin" && m.seen_at ? m.id : acc),
    null,
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <p className="font-semibold text-slate-800 dark:text-white text-sm">
            Support Inbox
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {conversations.length} conversations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-xs text-slate-400 text-center mt-10">
              No conversations yet
            </p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => {
                setActiveConv(conv);
                setInput("");
              }}
              className={`w-full text-left px-4 py-3.5 border-b border-slate-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3 ${
                activeConv?.id === conv.id
                  ? "bg-rose-50 dark:bg-rose-950 border-l-4 border-l-rose-500"
                  : ""
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                {conv.guest?.full_name?.[0]?.toUpperCase() ?? "G"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                    {conv.guest?.full_name ?? "Guest"}
                  </p>
                  {conv.unread_by_admin > 0 && (
                    <span className="ml-2 bg-rose-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {conv.unread_by_admin}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {conv.last_message_preview ?? "No messages yet"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 py-3 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {activeConv.guest?.full_name?.[0]?.toUpperCase() ?? "G"}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
                    isOnline ? "bg-green-500" : "bg-slate-300"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800 dark:text-white">
                  {activeConv.guest?.full_name ?? "Guest"}
                </p>
                <p className="text-xs text-slate-400">
                  {otherIsTyping ? (
                    <span className="text-green-500 font-medium">
                      typing...
                    </span>
                  ) : isOnline ? (
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
                    No messages yet
                  </p>
                </div>
              )}

              {messages.map((msg, i) => {
                const isMe = msg.sender_role === "admin";
                const nextMsg = messages[i + 1];
                const isLastInGroup =
                  !nextMsg || nextMsg.sender_role !== msg.sender_role;
                const showSeenAvatar = isMe && msg.id === lastSeenOwnMessageId;

                return (
                  <div key={msg.id}>
                    <div
                      className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                            isLastInGroup ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          {activeConv.guest?.full_name?.[0]?.toUpperCase() ??
                            "G"}
                        </div>
                      )}

                      <div
                        className={`max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? "bg-rose-500 text-white rounded-br-sm"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-100 dark:border-slate-700 rounded-bl-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {isLastInGroup && (
                          <div
                            className={`flex items-center gap-1 mt-1 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                          >
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isMe && (
                              <MessageTicks status={getTickStatus(msg)} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {showSeenAvatar && (
                      <div className="flex justify-end pr-1 mt-0.5">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[8px] font-bold">
                          {activeConv.guest?.full_name?.[0]?.toUpperCase() ??
                            "G"}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {otherIsTyping && <TypingDots />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
                onBlur={() => setTyping(false)}
                placeholder={`Reply to ${activeConv.guest?.full_name ?? "guest"}...`}
                className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
              💬
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Select a conversation
            </p>
            <p className="text-xs text-slate-400">
              Choose a guest from the left to start replying
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
