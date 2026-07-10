import { useState } from "react";
import { createPortal } from "react-dom";
import type { SupportMessage } from "@shared/types/support.types";

function Lightbox({
  url,
  type,
  onClose,
}: {
  url: string;
  type: "image" | "video";
  onClose: () => void;
}) {
  return createPortal(
    <div
      className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close"
      >
        ✕
      </button>
      {type === "image" ? (
        <img
          src={url}
          alt="Attachment"
          className="max-w-full max-h-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <video
          src={url}
          controls
          autoPlay
          className="max-w-full max-h-full rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>,
    document.body
  );
}

export function MessageAttachment({ msg }: { msg: SupportMessage }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!msg.attachment_url || !msg.attachment_type) return null;

  if (msg.attachment_type === "image") {
    return (
      <>
        <button
          onClick={() => setLightboxOpen(true)}
          className="block rounded-xl overflow-hidden w-[220px] h-[140px] max-w-full mb-1 shrink-0 bg-slate-100 dark:bg-slate-850"
        >
          <img
            src={msg.attachment_url}
            alt={msg.attachment_name ?? "Image"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </button>
        {lightboxOpen && (
          <Lightbox url={msg.attachment_url} type="image" onClose={() => setLightboxOpen(false)} />
        )}
      </>
    );
  }

  // video
  return (
    <>
      <button
        onClick={() => setLightboxOpen(true)}
        className="relative block rounded-xl overflow-hidden max-w-[220px] max-h-[220px] mb-1 shrink-0 bg-black/80"
      >
        {msg.thumbnail_url ? (
          <img
            src={msg.thumbnail_url}
            alt={msg.attachment_name ?? "Video"}
            className="w-full h-full object-cover opacity-90"
            loading="lazy"
          />
        ) : (
          <div className="w-[220px] h-[140px]" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="w-0 h-0 border-y-[8px] border-y-transparent border-l-[13px] border-l-white ml-1" />
          </div>
        </div>
      </button>
      {lightboxOpen && (
        <Lightbox url={msg.attachment_url} type="video" onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
