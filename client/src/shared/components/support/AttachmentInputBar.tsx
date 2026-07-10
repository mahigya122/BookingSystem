import { useRef } from "react";
import type { PendingAttachment } from "@shared/types/support.types";

interface Props {
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder: string;
  pending: PendingAttachment | null;
  onPickFile: (file: File) => void;
  onClearPending: () => void;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function AttachmentInputBar({
  input,
  onInputChange,
  onSend,
  onBlur,
  onKeyDown,
  placeholder,
  pending,
  onPickFile,
  onClearPending,
  isUploading,
  uploadProgress,
  uploadError,
  inputRef,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onPickFile(file);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const canSend = (!!input.trim() || !!pending) && !isUploading;

  return (
    <div className="p-4 shrink-0">
      {uploadError && (
        <div className="mb-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-medium">
          {uploadError}
        </div>
      )}

      {pending && (
        <div className="mb-2 flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-800/20">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
            {pending.type === "image" ? (
              <img src={pending.previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <video src={pending.previewUrl} className="w-full h-full object-cover" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">{uploadProgress}%</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
              {pending.file.name}
            </p>
            <p className="text-[10px] text-slate-400">
              {isUploading ? "Uploading..." : `${(pending.file.size / 1024 / 1024).toFixed(1)} MB`}
            </p>
          </div>
          {!isUploading && (
            <button
              onClick={onClearPending}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg leading-none px-1"
              aria-label="Remove attachment"
            >
              ✕
            </button>
          )}
        </div>
      )}

      <div className="rounded-[2rem] border border-emerald-100 dark:border-emerald-800/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-2 shadow-lg shadow-emerald-500/10 flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelected}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors shrink-0 disabled:opacity-40"
          aria-label="Attach image or video"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-1 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none min-w-0"
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors shrink-0"
          type="button"
        >
          →
        </button>
      </div>
    </div>
  );
}
