import { useEffect, useState, useRef } from "react";
import { useSupportMessages } from "@shared/hooks/useSupportMessages";
import { useDeliveryReceipts } from "@shared/hooks/useDeliveryReceipts";
import {
  useOnlinePresence,
  useWatchPresence,
  useTyping,
  formatLastSeen,
} from "@shared/hooks/usePresence";
import {
  getTickStatus,
  MessageTicks,
} from "@shared/components/support/MessageTicks";
import { supabase } from "@shared/services/supabase";
import { useUser } from "@shared/hooks";

function TypingDots() {
  return (
    <div className="flex justify-start">
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

export default function GuestMessages() {
  const { user } = useUser();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const { messages, sendMessage, bottomRef } = useSupportMessages(
    conversationId,
    "guest",
  );

  useOnlinePresence();
  useDeliveryReceipts("guest", user?.id ?? null);

  const { isOnline, lastSeenAt } = useWatchPresence(adminId);
  const { otherIsTyping, setTyping } = useTyping(
    conversationId,
    user?.id ?? null,
  );

  // Find or create conversation + get admin id
  useEffect(() => {
    if (!user) return;

    const init = async () => {
      const { data: existing } = await supabase
        .from("support_conversations")
        .select("id")
        .eq("guest_id", user.id)
        .maybeSingle();

      if (existing) {
        setConversationId(existing.id);
      } else {
        try {
          const { data: created, error } = await supabase
            .from("support_conversations")
            .insert({ guest_id: user.id, subject: "Direct Message" })
            .select("id")
            .single();
          if (error) throw error;
          if (created) setConversationId(created.id);
        } catch {
          // Unique constraint hit — another request created it first, so just fetch it
          const { data: refetched } = await supabase
            .from("support_conversations")
            .select("id")
            .eq("guest_id", user.id)
            .single();
          if (refetched) setConversationId(refetched.id);
        }
      }

      const { data: admin } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .single();
      if (admin) setAdminId(admin.id);
    };

    init();
  }, [user]);

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

  // Last message I sent that the admin has already seen — avatar goes under this one only
  const lastSeenOwnMessageId = messages.reduce<string | null>(
    (acc, m) => (m.sender_role === "guest" && m.seen_at ? m.id : acc),
    null,
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 py-3 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            S
          </div>
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
              isOnline ? "bg-green-500" : "bg-slate-300"
            }`}
          />
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800 dark:text-white">
            Support
          </p>
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
          const isMe = msg.sender_role === "guest";
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
                    S
                  </div>
                )}

                <div
                  className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-sky-500 text-white rounded-br-sm"
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
                      {isMe && <MessageTicks status={getTickStatus(msg)} />}
                    </div>
                  )}
                </div>

                {isMe && (
                  <div
                    className={`w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                      isLastInGroup ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    G
                  </div>
                )}
              </div>

              {showSeenAvatar && (
                <div className="flex justify-end pr-9 mt-0.5">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-[8px] font-bold">
                    S
                  </div>
                </div>
              )}
            </div>
          );
        })}{" "}
        {otherIsTyping && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
        <input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
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
  );
}
