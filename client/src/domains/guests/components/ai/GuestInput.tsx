import { Send } from "lucide-react";
import type { Ref } from "react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
    inputRef?: Ref<HTMLInputElement>;
}

const GuestInput = ({
    value,
    onChange,
    onSend,
    disabled = false,
    inputRef,
}: Props) => {
    return (
        <div className="flex items-center gap-2 p-1">
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSend();
                    }
                }}
                placeholder="Message concierge..."
                className="flex-1 bg-transparent px-4 py-3 text-sm font-medium outline-none transition dark:text-white placeholder:text-slate-400"
            />

            <button
                onClick={onSend}
                disabled={disabled || !value.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-500 text-white transition-all hover:bg-sky-600 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 shadow-lg shadow-sky-500/20"
            >
                <Send size={18} />
            </button>
        </div>
    );
};

export default GuestInput;
