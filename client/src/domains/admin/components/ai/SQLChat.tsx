import { useEffect, useRef, useState } from "react";
import { useUser } from "@shared/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bot } from "lucide-react";
import SQLInput from "./SQLInput";
import SQLMessage from "./SQLMessage";
import { askSqlCopilot, getLatestConversation, getSuggestions } from "../../ai/sqlAI";
import type { SQLMessage as SQLMessageType } from '@shared/types/sql';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

const FALLBACK_SUGGESTIONS = [
  "Show all cancelled bookings",
  "Who is arriving today?",
  "How many cabins are occupied?",
];

const Airplane = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 80 80" fill="none">
    <path
      d="M10 40 L70 15 L60 40 L70 65 Z"
      fill="currentColor"
      opacity="0.18"
    />
    <path
      d="M60 40 L30 50 L35 40 L30 30 Z"
      fill="currentColor"
      opacity="0.25"
    />
  </svg>
);

const Palm = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 140" fill="none">
    <rect
      x="46"
      y="60"
      width="8"
      height="80"
      rx="4"
      fill="#38bdf8"
      opacity="0.2"
    />
    <ellipse
      cx="50"
      cy="55"
      rx="30"
      ry="18"
      fill="#7dd3fc"
      opacity="0.15"
      transform="rotate(-20 50 55)"
    />
    <ellipse
      cx="50"
      cy="50"
      rx="26"
      ry="14"
      fill="#0ea5e9"
      opacity="0.15"
      transform="rotate(15 50 50)"
    />
    <ellipse
      cx="50"
      cy="45"
      rx="22"
      ry="12"
      fill="#38bdf8"
      opacity="0.2"
      transform="rotate(-35 50 45)"
    />
  </svg>
);

const DashedCircle = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none">
    <circle
      cx="100"
      cy="100"
      r="90"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="8 6"
      opacity="0.12"
    />
  </svg>
);

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const SQLChat = ({ isOpen, onClose }: Props) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<SQLMessageType[]>([]);
  const [pendingHistory, setPendingHistory] = useState<SQLMessageType[] | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(FALLBACK_SUGGESTIONS);
  const endRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [wasOpen, setWasOpen] = useState(isOpen);

  const fullName = user?.user_metadata?.full_name || user?.email || "Admin";
  const getInitials = (name: string) => {
    if (!name) return "A";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "A";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const userInitials = getInitials(fullName);

  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setInput("");
      setLoading(false);
      setMessages([]);
      setConversationId(null);
      setSuggestions(FALLBACK_SUGGESTIONS);
    }
  }

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    } else {
      endRef.current?.scrollIntoView({ behavior, block: "end" });
    }
  };

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    let cancelled = false;

    if (!isOpen) {
      return () => {
        cancelled = true;
      };
    }

    const loadConversation = async () => {
      try {
        const userId = user?.id || "anonymous";
        const result = await getLatestConversation(userId);

        if (cancelled || !result) return;

        if (result.conversationId) {
          setConversationId(result.conversationId);
        }

        if (Array.isArray(result.history)) {
          const hist = result.history
            .filter((entry: { role?: string; content?: string }) => entry?.role && entry?.content)
            .map((entry: { role: "user" | "assistant"; content: string }) => ({
              role: entry.role,
              content: entry.content,
            }));

          setPendingHistory(hist.length ? hist : null);
        }
      } catch {
        if (!cancelled) {
          setPendingHistory(null);
        }
      }
    };

    void loadConversation();

    return () => {
      cancelled = true;
    };
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadSuggestions() {
      try {
        const data = await getSuggestions(user?.id);

        if (!cancelled) {
          const nextSuggestions = Array.isArray(data?.suggestions) && data.suggestions.length > 0
            ? data.suggestions
            : FALLBACK_SUGGESTIONS;

          setSuggestions(nextSuggestions);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setSuggestions(FALLBACK_SUGGESTIONS);
        }
      }
    }

    void loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, [isOpen, user?.id]);

  const handleSend = async (manualInput?: string) => {
    const textToSend = manualInput || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: SQLMessageType = {
      role: "user",
      content: textToSend,
    };

    if (pendingHistory && messages.length === 0) {
      setMessages([...pendingHistory, userMessage]);
      setPendingHistory(null);
    } else {
      setMessages((prev) => [...prev, userMessage]);
    }
    setInput("");
    setLoading(true);
    
    // Scroll down immediately
    setTimeout(() => {
      scrollToBottom("auto");
    }, 30);


    try {
      const result = await askSqlCopilot(userMessage.content, user?.id || "anonymous", conversationId || undefined);
      if (result?.conversationId) {
        setConversationId(result.conversationId);
      }
      const answer = result?.answer || "I couldn't generate an answer right now.";
      if (Array.isArray(result?.history)) {
        const hist = result.history
          .filter((entry: { role?: string; content?: string }) => entry?.role && entry?.content)
          .map((entry: { role: "user" | "assistant"; content: string }) => ({
            role: entry.role,
            content: entry.content,
          }));

        setMessages(hist);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: answer,
          },
        ]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error generating SQL query. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0 || loading) {
      scrollToBottom("auto");
    }
  }, [messages, loading]);

  return (
    <div className="flex h-full flex-col overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/20">
      {/* CHAT HEADER */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b bg-white/60 dark:bg-slate-950/60 backdrop-blur-md relative z-30"
        style={{ borderColor: "var(--app-border)" }}
      >
        <div className="flex items-center gap-3">
          {/* AI Avatar */}
          <div className="relative">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/10 border border-white/20 dark:border-slate-800">
              <Bot size={22} strokeWidth={2} />
            </div>
            {/* Status Dot */}
            <span
              className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-950 ${
                loading ? "bg-blue-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
          </div>
          {/* Identity & Status */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-0.5">
              Assistant
            </span>
            <span className="text-sm md:text-base font-black text-slate-800 dark:text-white leading-tight">
              SQL Copilot
            </span>
            <span className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              {loading ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                  Typing...
                </>
              ) : (
                <></>
              )}
            </span>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-2xl border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
          style={{
            borderColor: "var(--app-border)",
          }}
        >
          <X size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* DECORATIVE BLUR CIRCLES */}
      <div className="absolute top-20 left-10 w-48 h-48 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl pointer-events-none" />

      {/* DECORATIVE SVGS */}
      <DashedCircle className="absolute -top-10 -right-10 w-64 h-64 text-sky-400 pointer-events-none" />
      <DashedCircle className="absolute bottom-20 -left-10 w-48 h-48 text-sky-300 pointer-events-none" />
      <Airplane className="absolute top-32 left-8 w-14 h-14 text-sky-400 -rotate-12 pointer-events-none opacity-20" />
      <Palm className="absolute bottom-0 left-2 w-24 h-32 pointer-events-none opacity-60" />
      <Palm className="absolute bottom-0 right-2 w-20 h-28 pointer-events-none opacity-30 scale-x-[-1]" />

      <AnimatePresence mode="wait">
        {messages.length === 0 ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-10 relative z-10"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <motion.p
                  className="text-sky-500 text-xl md:text-2xl font-bold"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  Welcome to FlowAI
                </motion.p>
                <motion.h2
                  className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                >
                  Database <span className="text-sky-500">Copilot</span>
                </motion.h2>
              </div>

              <motion.p
                className="text-slate-500 dark:text-slate-400 font-medium max-w-[300px] mx-auto text-sm md:text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              >
                How can I help you query bookings, cabins, or guests today?
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col overflow-hidden relative z-10"
          >
            {/* MESSAGES */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6 custom-scrollbar-hide">
              {messages.map((msg, i) => (
                <SQLMessage
                  key={i}
                  role={msg.role}
                  content={msg.content}
                  userInitials={userInitials}
                />
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-xs font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
                  style={{
                    borderColor: "var(--app-border)",
                    color: "var(--app-text-main)",
                  }}
                >
                  <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
                  SQL Copilot is typing...
                </motion.div>
              )}

              <div ref={endRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT AREA */}
      <div className="p-4 md:p-6 relative z-20">
        {suggestions.length > 0 && !loading && (messages.length === 0 || input.trim().length > 0) && (
          <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSend(suggestion)}
                className="flex-shrink-0 rounded-full border px-5 py-2.5 text-[11px] font-black bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:border-sky-500 hover:text-sky-600 transition-all duration-300 whitespace-nowrap shadow-sm text-slate-600 dark:text-slate-200 uppercase tracking-wider cursor-pointer"
                style={{
                  borderColor: "var(--app-border)",
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="rounded-[2rem] border border-sky-100 dark:border-sky-800/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-2 shadow-2xl shadow-sky-500/10">
          <SQLInput
            inputRef={inputRef}
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default SQLChat;
