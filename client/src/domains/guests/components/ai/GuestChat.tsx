import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@shared/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import GuestInput from "./GuestInput";
import GuestMessage from "./GuestMessage";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const FALLBACK_SUGGESTIONS = [
    "Which is the most 5-star rated cabin?",
    "Which cabin offers the most activities?",
    "Which cabin has free breakfast?",
    "How do I book a cabin?",
];

const Airplane = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 80 80" fill="none">
        <path d="M10 40 L70 15 L60 40 L70 65 Z" fill="currentColor" opacity="0.18" />
        <path d="M60 40 L30 50 L35 40 L30 30 Z" fill="currentColor" opacity="0.25" />
    </svg>
);

const Palm = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 140" fill="none">
        <rect x="46" y="60" width="8" height="80" rx="4" fill="#38bdf8" opacity="0.2" />
        <ellipse cx="50" cy="55" rx="30" ry="18" fill="#7dd3fc" opacity="0.15" transform="rotate(-20 50 55)" />
        <ellipse cx="50" cy="50" rx="26" ry="14" fill="#0ea5e9" opacity="0.15" transform="rotate(15 50 50)" />
        <ellipse cx="50" cy="45" rx="22" ry="12" fill="#38bdf8" opacity="0.2" transform="rotate(-35 50 45)" />
    </svg>
);

const DashedCircle = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" opacity="0.12" />
    </svg>
);

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const GuestChat = ({ isOpen, onClose }: Props) => {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(FALLBACK_SUGGESTIONS);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const endRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    };

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen !== prevIsOpen) {
        setPrevIsOpen(isOpen);
        // Cleanup: Clear messages for public users when closing the drawer
        if (!isOpen && !user?.id) {
            setMessages([]);
            setConversationId(null);
        }
    }

    const loadSuggestions = useCallback(async () => {
        try {
            const userIdParam = user?.id ? `&userId=${user.id}` : "";
            const res = await fetch(`/api/suggestions?role=guest${userIdParam}`);

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
            // If logged in, fetch history in background
            try {
                if (user?.id) {
                    const res = await fetch(`/api/ai/guest/conversation/latest?userId=${user.id}`);
                    const data = await res.json();

                    if (data.conversationId) {
                        setConversationId(data.conversationId);
                        if (Array.isArray(data.history) && data.history.length > 0) {
                            setMessages(data.history);
                            // We do NOT set setIsFirstOpen(false) here because 
                            // we want to show the greeting first every time
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
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        setInput("");
        setLoading(true);

        try {
            const res = await fetch(
                "/api/ai/guest/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: textToSend,
                        userId: user?.id,
                        conversationId: conversationId,
                        history: user?.id ? undefined : updatedMessages // Send history for public users
                    }),
                }
            );

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
                        content:
                            data.reply ||
                            "Sorry, I couldn't generate a response.",
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
        <div className="flex h-full flex-col overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/20">
            {/* FLOATING CLOSE BUTTON */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 h-10 w-10 rounded-2xl border bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl flex items-center justify-center hover:bg-white/60 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm active:scale-95"
                style={{
                    borderColor: "var(--app-border)",
                }}
            >
                <X size={20} className="text-slate-600 dark:text-slate-300" />
            </button>

            {/* DECORATIVE BLUR CIRCLES (Matching Layout) */}
            <div className="absolute top-20 left-10 w-48 h-48 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-40 right-10 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl pointer-events-none" />

            {/* DECORATIVE ELEMENTS */}
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
                                    Welcome to HotelFlow
                                </motion.p>
                                <motion.h2
                                    className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                                >
                                    Your Next <span className="text-sky-500">Escape</span> Awaits
                                </motion.h2>
                            </div>

                            <motion.p
                                className="text-slate-500 dark:text-slate-400 font-medium max-w-[300px] mx-auto text-sm md:text-lg leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
                            >
                                How can I help you find your perfect nature escape today?
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
                        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6 custom-scrollbar-hide">
                            {messages.map((msg, i) => (
                                <GuestMessage
                                    key={i}
                                    role={msg.role}
                                    content={msg.content}
                                />
                            ))}

                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-xs font-bold"
                                    style={{
                                        borderColor: "var(--app-border)",
                                        color: "var(--app-text-main)",
                                        background: "rgba(255, 255, 255, 0.8)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />
                                    AI Concierge is typing...
                                </motion.div>
                            )}

                            <div ref={endRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* INPUT AREA */}
            <div className="p-4 md:p-6 relative z-20">
                {/* SUGGESTIONS: Only shown when user types */}
                {suggestions.length > 0 && input.trim().length > 0 && !loading && (
                    <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar scroll-smooth">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => handleSend(suggestion)}
                                className="flex-shrink-0 rounded-full border px-5 py-2.5 text-[11px] font-black bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm hover:border-sky-500 hover:text-sky-600 transition-all duration-300 whitespace-nowrap shadow-sm text-slate-600 dark:text-slate-200 uppercase tracking-wider"
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
                    <GuestInput
                        inputRef={inputRef}
                        value={input}
                        onChange={(val) => {
                            setInput(val);
                            if (suggestions.length === 0 && val.trim().length > 0) {
                                loadSuggestions();
                            }
                        }}
                        onSend={() => handleSend()}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default GuestChat;
