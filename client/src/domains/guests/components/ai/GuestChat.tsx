import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthUser } from "@shared/hooks/auth/useAuthUser";

import GuestInput from "./GuestInput";
import GuestMessage from "./GuestMessage";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface Props {
    isOpen: boolean;
}

const FALLBACK_SUGGESTIONS = [
    "Which cabins are available?",
    "Do you offer discounts?",
    "What is your best luxury cabin?",
];

const GuestChat = ({ isOpen }: Props) => {
    const { user } = useAuthUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState(FALLBACK_SUGGESTIONS);
    const [conversationId, setConversationId] = useState<string | null>(null);

    const endRef = useRef<HTMLDivElement | null>(null);

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
            // If already have messages and not logged in, don't re-initialize
            if (messages.length > 0 && !user?.id) return;

            setLoading(true);
            
            try {
                if (user?.id) {
                    const res = await fetch(`/api/ai/guest/conversation/latest?userId=${user.id}`);
                    const data = await res.json();
                    
                    if (data.conversationId) {
                        setConversationId(data.conversationId);
                        if (Array.isArray(data.history) && data.history.length > 0) {
                            setMessages(data.history);
                        } else {
                            addWelcomeMessage();
                        }
                    } else {
                        addWelcomeMessage();
                    }
                } else {
                    // Public user: only add welcome if empty
                    if (messages.length === 0) {
                        addWelcomeMessage();
                    }
                }
            } catch (err) {
                console.error("Failed to load conversation history:", err);
                if (messages.length === 0) addWelcomeMessage();
            } finally {
                setLoading(false);
                loadSuggestions();
            }
        }

        function addWelcomeMessage() {
            setMessages([
                {
                    role: "assistant",
                    content:
                        "Welcome to HotelFlow ✨ How may I help you find your perfect stay today?",
                },
            ]);
        }

        initChat();
    }, [isOpen, user?.id, loadSuggestions, messages.length]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: "user",
            content: input,
        };

        // Use functional update to ensure we have latest state, 
        // but for sending we need the snapshot
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);

        const currentInput = input;

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
                        message: currentInput,
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
        <div
            className="flex h-full flex-col overflow-hidden rounded-2xl border shadow-[0_18px_48px_-30px_rgba(15,23,42,0.28)]"
            style={{
                background:
                    "linear-gradient(180deg, color-mix(in srgb, var(--app-surface-elevated) 96%, transparent) 0%, color-mix(in srgb, var(--app-surface) 94%, transparent) 100%)",
                borderColor: "var(--app-border)",
            }}
        >
            {/* CHAT */}
            <div
                className="flex-1 space-y-3 overflow-y-auto p-3"
                style={{
                    background:
                        "color-mix(in srgb, var(--app-surface-elevated) 68%, transparent)",
                }}
            >
                {messages.map((msg, i) => (
                    <GuestMessage
                        key={i}
                        role={msg.role}
                        content={msg.content}
                    />
                ))}

                {loading && (
                    <div
                        className="inline-flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium"
                        style={{
                            borderColor: "var(--app-border)",
                            color: "var(--app-text-muted)",
                            background:
                                "color-mix(in srgb, var(--app-surface-elevated) 88%, transparent)",
                        }}
                    >
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                        AI Concierge is typing...
                    </div>
                )}

                <div ref={endRef} />
            </div>

            {/* INPUT */}
            <div
                className="space-y-3 border-t px-3 py-3"
                style={{
                    borderColor: "var(--app-border)",
                    background:
                        "color-mix(in srgb, var(--app-surface-elevated) 86%, transparent)",
                }}
            >
                <div className="space-y-2">
                    <div
                        className="text-[12px] font-semibold uppercase tracking-[0.28em]"
                        style={{
                            color: "var(--app-text-muted)",
                        }}
                    >
                        Suggested Questions
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setInput(suggestion)}
                                className="rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm transition hover:border-emerald-500 hover:text-emerald-600"
                                style={{
                                    borderColor: "var(--app-border)",
                                }}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                <GuestInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    disabled={loading}
                />
            </div>
        </div>
    );
};

export default GuestChat;