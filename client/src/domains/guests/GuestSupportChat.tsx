import { useEffect, useState, useRef } from "react";
import { useSupportMessages } from "@shared/hooks/useSupportMessages";
import { useDeliveryReceipts } from "@shared/hooks/useDeliveryReceipts";
import { useAttachmentUpload } from "@shared/hooks/useAttachmentUpload";
import {
  useOnlinePresence,
  useWatchPresence,
  useTyping,
} from "@shared/hooks/usePresence";
import {
  getTickStatus,
  MessageTicks,
} from "@shared/components/support/MessageTicks";
import { MessageAttachment } from "@shared/components/support/MessageAttachment";
import { AttachmentInputBar } from "@shared/components/support/AttachmentInputBar";
import { supabase } from "@shared/services/supabase";
import { useUser } from "@shared/hooks";
import { useClientAIChat } from "./ClientAIChatContext";
import type { PendingAttachment } from "@shared/types/support.types";

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
  const { pendingSupportMessage, setPendingSupportMessage } = useClientAIChat();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<PendingAttachment | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, bottomRef } = useSupportMessages(
    conversationId,
    "guest",
    isOpen && isActive
  );
  const { upload, isUploading, progress, error: uploadError, setError: setUploadError } =
    useAttachmentUpload();

  useOnlinePresence();
  useDeliveryReceipts("guest", user?.id ?? null);

  const { otherIsTyping, setTyping } = useTyping(conversationId, user?.id ? `${user.id}:guest` : null);
  const lastAdminMessage = messages.slice().reverse().find((m) => m.sender_role === "admin");
  const adminId = lastAdminMessage?.sender_id ?? null;
  const { isOnline: isAdminOnline } = useWatchPresence(adminId);

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

  // Pre-fill input when redirected here from the AI concierge with a pending question
  useEffect(() => {
    if (isOpen && isActive && pendingSupportMessage) {
      setInput(pendingSupportMessage);
      setPendingSupportMessage(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isActive, pendingSupportMessage, setPendingSupportMessage]);

  // Revoke local preview URL when replaced/cleared to avoid memory leaks
  useEffect(() => {
    return () => {
      if (pendingAttachment) URL.revokeObjectURL(pendingAttachment.previewUrl);
    };
  }, [pendingAttachment]);

  const handlePickFile = (file: File) => {
    const type = file.type.startsWith("video/") ? "video" : file.type.startsWith("image/") ? "image" : null;
    if (!type) {
      setUploadError("Unsupported file type. Please pick an image or video.");
      return;
    }
    if (pendingAttachment) URL.revokeObjectURL(pendingAttachment.previewUrl);
    setUploadError(null);
    setPendingAttachment({ file, previewUrl: URL.createObjectURL(file), type });
  };

  const handleClearPending = () => {
    if (pendingAttachment) URL.revokeObjectURL(pendingAttachment.previewUrl);
    setPendingAttachment(null);
    setUploadError(null);
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingAttachment) || !user || !conversationId) return;
    setTyping(false);

    let uploaded = null;
    if (pendingAttachment) {
      uploaded = await upload(pendingAttachment.file, conversationId);
      if (!uploaded) return; // upload failed, error already set
    }

    await sendMessage(input, user.id, uploaded);
    setInput("");
    handleClearPending();
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
      {/* Subheader / Agent status */}
      <div className="bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-150 dark:border-slate-800 px-4 py-3 flex items-center gap-3 shrink-0 relative z-20">
        <div className="relative">
          <Avatar style={ADMIN_STYLE} initial="S" size="w-8 h-8" textSize="text-xs" />
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
              isAdminOnline ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none mb-0.5">
            Support Agent
          </span>
          <span className="text-xs font-black text-slate-800 dark:text-white leading-tight">
            Property Concierge
          </span>
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            {otherIsTyping ? (
              <span className="text-emerald-500">typing...</span>
            ) : isAdminOnline ? (
              <span className="text-emerald-500">Online</span>
            ) : (
              "last seen recently"
            )}
          </span>
        </div>
      </div>

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
          const hasAttachment = !!msg.attachment_url;

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
                    className={`${hasAttachment ? "p-1.5" : "px-4 py-2.5"} rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-sky-500 text-white rounded-br-sm"
                        : "bg-emerald-100 text-emerald-950 rounded-bl-sm dark:bg-emerald-900/40 dark:text-emerald-50"
                    }`}
                  >
                    {hasAttachment && <MessageAttachment msg={msg} />}
                    {msg.content && (
                      <span className={hasAttachment ? "block px-2.5 pb-1 pt-0.5" : ""}>{msg.content}</span>
                    )}
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
      <AttachmentInputBar
        input={input}
        onInputChange={handleTyping}
        onSend={handleSend}
        onBlur={() => setTyping(false)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        placeholder="Message support..."
        pending={pendingAttachment}
        onPickFile={handlePickFile}
        onClearPending={handleClearPending}
        isUploading={isUploading}
        uploadProgress={progress}
        uploadError={uploadError}
        inputRef={inputRef}
      />
    </div>
  );
}
