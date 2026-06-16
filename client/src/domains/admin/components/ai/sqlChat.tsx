import { useEffect, useRef, useState } from "react";
import { useUser } from "@shared/hooks";
import SQLInput from "./SQLInput";
import SQLMessage from "./SQLMessage";
import { askSqlCopilot, getLatestConversation, getSuggestions } from "../../services/ai/sqlAI";
import type { SQLMessage as SQLMessageType } from '@shared/types/sql';

interface Props {
  isOpen: boolean;
}

const FALLBACK_SUGGESTIONS = [
  "Show all cancelled bookings",
  "Who is arriving today?",
  "How many cabins are occupied?",
];

const SQLChat = ({ isOpen }: Props) => {
  const { user } = useUser();
  const [messages, setMessages] = useState<SQLMessageType[]>([]);
  const [pendingHistory, setPendingHistory] = useState<SQLMessageType[] | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(FALLBACK_SUGGESTIONS);
  const endRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    endRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  useEffect(() => {
    if (isOpen) {
      setInput("");
      setLoading(false);
      setMessages([]);
      setConversationId(null);
      setSuggestions(FALLBACK_SUGGESTIONS);
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

          // keep previous conversation in a pending buffer so the pane
          // can start clean with suggestions. We'll merge it into the
          // visible `messages` when the user actually sends a question.
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

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: SQLMessageType = {
      role: "user",
      content: input,
    };

    // If we have pending history, reveal it now so the user sees the
    // full conversation context alongside their new message.
    if (pendingHistory && messages.length === 0) {
      setMessages([...pendingHistory, userMessage]);
      setPendingHistory(null);
    } else {
      setMessages((prev) => [...prev, userMessage]);
    }
    setInput("");
    setLoading(true);
    requestAnimationFrame(() => scrollToBottom("smooth"));

    try {
      const result = await askSqlCopilot(userMessage.content, user?.id || "anonymous", conversationId || undefined);
      if (result?.conversationId) {
        setConversationId(result.conversationId);
      }
      const answer = result?.answer || "I couldn't generate an answer right now.";
      // If the backend returned the whole history, prefer that (keeps server-side truth).
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
    // Only auto-scroll when there are messages or when loading an answer.
    // Avoid scrolling on open when the pane is empty so suggestion pills stay visible.
    if (messages.length > 0 || loading) {
      scrollToBottom("smooth");
    }
  }, [messages, loading]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border shadow-[0_18px_48px_-30px_rgba(15,23,42,0.28)]" style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--app-surface-elevated) 96%, transparent) 0%, color-mix(in srgb, var(--app-surface) 94%, transparent) 100%)", borderColor: "var(--app-border)" }}>
      <div className="flex-1 space-y-3 overflow-y-auto p-3" style={{ background: "color-mix(in srgb, var(--app-surface-elevated) 68%, transparent)" }}>
        {messages.length === 0 && !loading && input.trim().length === 0 && (
          <div className="rounded-2xl border border-dashed px-4 py-3 text-sm font-medium" style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}>
            
          </div>
        )}

        {messages.length === 0 && !loading && input.trim().length === 0 && (
          <div className="hidden" />
        )}

        {messages.map((msg, i) => (
          <SQLMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <div className="inline-flex items-center gap-3 rounded-xl border px-3 py-2 text-sm font-medium" style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)", background: "color-mix(in srgb, var(--app-surface-elevated) 88%, transparent)" }}>
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--app-primary)" }} />
            Generating SQL and saving chat...
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="space-y-3 border-t px-3 py-3" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface-elevated) 86%, transparent)" }}>
        {messages.length === 0 && !loading && input.trim().length === 0 && (
          <div className="space-y-2">
            <div className="text-[12px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--app-text-muted)" }}>
              Where should we begin?
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInput(suggestion)}
                  className="btn btn-secondary rounded-full px-3 py-1.5 text-[11px] font-semibold normal-case tracking-normal shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <SQLInput value={input} onChange={setInput} onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
};

export default SQLChat;