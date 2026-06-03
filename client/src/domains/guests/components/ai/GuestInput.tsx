interface Props {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
}

const GuestInput = ({
    value,
    onChange,
    onSend,
    disabled = false,
}: Props) => {
    return (
        <div
            className="flex gap-2 rounded-2xl border p-1.5 shadow-sm"
            style={{
                borderColor: "var(--app-border)",
                background:
                    "color-mix(in srgb, var(--app-surface-elevated) 88%, transparent)",
            }}
        >
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onSend();
                    }
                }}
                placeholder="Ask about cabins, pricing, amenities..."
                className="flex-1 rounded-xl border px-3.5 py-2.5 outline-none transition"
                style={{
                    background:
                        "color-mix(in srgb, var(--app-surface) 88%, transparent)",
                    borderColor: "var(--app-border)",
                    color: "var(--app-text-main)",
                }}
            />

            <button
                onClick={onSend}
                disabled={disabled}
                className="rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {disabled ? "Sending..." : "Send"}
            </button>
        </div>
    );
};

export default GuestInput;