import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@shared/hooks";
import { Bot, User } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";

interface Message {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hideOwnClose?: boolean;
  isActive?: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

const FALLBACK_SUGGESTIONS = [
  "Which is the most 5-star rated cabin?",
  "Which cabin offers the most activities?",
  "Which cabin has free breakfast?",
  "How do I book a cabin?",
];

const ME_STYLE = { grad: "from-sky-400 to-blue-600", ring: "ring-sky-200" };
const AI_STYLE = { grad: "from-sky-500 to-indigo-600", ring: "ring-sky-300" };

function Avatar({
  style,
  initial,
  icon,
  size = "w-9 h-9",
  textSize = "text-sm",
}: {
  style: { grad: string; ring: string };
  initial?: string;
  icon?: React.ReactNode;
  size?: string;
  textSize?: string;
}) {
  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br ${style.grad} flex items-center justify-center text-white font-bold ${textSize} shrink-0 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${style.ring}`}
    >
      {icon ? icon : initial}
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

const GuestChat = ({ isOpen, isActive }: Props) => {
  const { user } = useUser();
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(FALLBACK_SUGGESTIONS);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const fullName = profile?.full_name || user?.user_metadata?.full_name || "";
  const getInitials = (name: string) => {
    if (!name) return "G";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "G";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const userInitials = getInitials(fullName);

  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && isActive) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isActive]);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen && !user?.id) {
      setMessages([]);
      setConversationId(null);
    }
  }

  const loadSuggestions = useCallback(async () => {
    try {
      const userIdParam = user?.id ? `&userId=${user.id}` : "";
      const res = await fetch(
        `${BACKEND_URL}/api/suggestions?role=guest${userIdParam}`,
      );
      const data = await res.json();
      if (Array.isArray(data?.suggestions)) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error("Failed to load suggestions:", err);
      setSuggestions(FALLBACK_SUGGESTIONS);
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen) return;

    async function initChat() {
      try {
        if (user?.id) {
          const res = await fetch(
            `${BACKEND_URL}/api/ai/guest/conversation/latest?userId=${user.id}`,
          );
          const data = await res.json();
          if (data.conversationId) {
            setConversationId(data.conversationId);
            if (Array.isArray(data.history) && data.history.length > 0) {
              setMessages(data.history);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load conversation history:", err);
      } finally {
        setLoading(false);
        loadSuggestions();
      }
    }

    initChat();
  }, [isOpen, user?.id, loadSuggestions]);

  const handleSend = async (manualInput?: string) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      created_at: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/ai/guest/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textToSend,
          userId: user?.id,
          conversationId: conversationId,
          history: user?.id ? undefined : updatedMessages,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to contact AI assistant");
      }

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      if (Array.isArray(data.history)) {
        setMessages(data.history);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || "Sorry, I couldn't generate a response.",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err: unknown) {
      console.error("AI Chat Error:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            errorMessage === "Failed to fetch"
              ? "Connection to AI server refused. Please ensure the backend is running."
              : `Error: ${errorMessage || "Something went wrong while contacting the AI assistant."}`,
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/10">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
        {messages.length === 0 && (
          <div className="flex justify-center pt-8">
            <p className="text-xs text-slate-400 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
              Send a message to start chatting with AI Concierge
            </p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.role === "user";
          const nextMsg = messages[i + 1];
          const isLastInGroup = !nextMsg || nextMsg.role !== msg.role;
          const msgTime = msg.created_at ? new Date(msg.created_at) : new Date();

          return (
            <div key={i}>
              <div className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                  <div className={isLastInGroup ? "opacity-100" : "opacity-0"}>
                    <Avatar style={AI_STYLE} icon={<Bot size={14} />} size="w-7 h-7" />
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-sky-500 text-white rounded-br-sm"
                        : "bg-sky-100 text-sky-950 rounded-bl-sm dark:bg-sky-900/40 dark:text-sky-50"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {isLastInGroup && (
                    <div className={`flex items-center gap-1 mt-1 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                      <span className="text-[10px] text-slate-400">
                        {msgTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  )}
                </div>
                {isMe && (
                  <div className={isLastInGroup ? "opacity-100" : "opacity-0"}>
                    <Avatar 
                      style={ME_STYLE} 
                      initial={userInitials} 
                      icon={userInitials === "G" ? <User size={13} /> : undefined}
                      size="w-7 h-7" 
                      textSize="text-[10px]" 
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && <TypingDots />}
        <div ref={endRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 shrink-0">
        {/* Suggestions row directly above input box */}
        {suggestions.length > 0 && input.trim().length > 0 && !loading && (
          <div className="flex overflow-x-auto pb-3 gap-2 no-scrollbar scroll-smooth">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="flex-shrink-0 rounded-full border border-sky-100 dark:border-sky-900/20 px-4 py-2 text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:border-sky-500 hover:text-sky-600 transition-all duration-300 whitespace-nowrap shadow-sm text-slate-600 dark:text-slate-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="rounded-[2rem] border border-sky-100 dark:border-sky-800/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-2 shadow-lg shadow-sky-500/10 flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask AI Concierge..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shrink-0"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestChat;
