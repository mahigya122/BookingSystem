import { useEffect, useState, useRef } from "react";
import { useSupportMessages } from "@shared/hooks/useSupportMessages";
import { useDeliveryReceipts } from "@shared/hooks/useDeliveryReceipts";
import {
  useOnlinePresence,
  useTyping,
} from "@shared/hooks/usePresence";
import {
  getTickStatus,
  MessageTicks,
} from "@shared/components/support/MessageTicks";
import { supabase } from "@shared/services/supabase";
import { useUser } from "@shared/hooks";

const ME_STYLE = { grad: "from-sky-400 to-blue-600", ring: "ring-sky-200" };
const ADMIN_STYLE = { grad: "from-emerald-400 to-teal-600", ring: "ring-emerald-200" };

function Avatar({
  style,
  initial,
  size = "w-9 h-9",
  textSize = "text-sm",
}: {
  style: { grad: string; ring: string };
  initial: string;
  size?: string;
  textSize?: string;
}) {
  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br ${style.grad} flex items-center justify-center text-white font-bold ${textSize} shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${style.ring}`}
    >
      {initial}
    </div>
  );
}

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

interface Props {
  isOpen: boolean;
  isActive?: boolean;
}

export default function GuestSupportChat({ isOpen, isActive }: Props) {
  const { user } = useUser();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, bottomRef } = useSupportMessages(
    conversationId,
    "guest",
    isOpen && isActive
  );

  useOnlinePresence();
  useDeliveryReceipts("guest", user?.id ?? null);

  const { otherIsTyping, setTyping } = useTyping(conversationId, user?.id ?? null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isActive) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isActive, bottomRef]);

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
          const { data: refetched } = await supabase
            .from("support_conversations")
            .select("id")
            .eq("guest_id", user.id)
            .single();
          if (refetched) setConversationId(refetched.id);
        }
      }
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

  const lastSeenOwnMessageId = messages.reduce<string | null>(
    (acc, m) => (m.sender_role === "guest" && m.seen_at ? m.id : acc),
    null,
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/10">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        {messages.length === 0 && (
          <div className="flex justify-center pt-8">
            <p className="text-xs text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
              Send a message to reach our team
            </p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender_role === "guest";
          const nextMsg = messages[i + 1];
          const isLastInGroup = !nextMsg || nextMsg.sender_role !== msg.sender_role;
          const showSeenAvatar = isMe && msg.id === lastSeenOwnMessageId;

          return (
            <div key={msg.id}>
              <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <div className={isLastInGroup ? "opacity-100" : "opacity-0"}>
                    <Avatar style={ADMIN_STYLE} initial="S" size="w-7 h-7" textSize="text-xs" />
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-sky-500 text-white rounded-br-sm"
                        : "bg-emerald-100 text-emerald-950 rounded-bl-sm dark:bg-emerald-900/40 dark:text-emerald-50"
                    }`}
                  >
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
                    <Avatar style={ME_STYLE} initial="G" size="w-7 h-7" textSize="text-xs" />
                  </div>
                )}
              </div>
              {showSeenAvatar && (
                <div className="flex justify-end pr-9 mt-0.5">
                  <Avatar style={ADMIN_STYLE} initial="S" size="w-4 h-4" textSize="text-[8px]" />
                </div>
              )}
            </div>
          );
        })}
        {otherIsTyping && <TypingDots />}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 shrink-0">
        <div className="rounded-[2rem] border border-emerald-100 dark:border-emerald-800/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-2 shadow-lg shadow-emerald-500/10 flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            onBlur={() => setTyping(false)}
            placeholder="Message support..."
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
    </div>
  );
}