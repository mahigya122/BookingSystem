interface Props {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
}

const SQLInput = ({ value, onChange, onSend, disabled = false }: Props) => {
    return (
        <div className="flex gap-2 rounded-3xl border p-2 shadow-sm" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface-elevated) 88%, transparent)" }}>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ask something about your database..."
                className="flex-1 rounded-2xl border px-4 py-3 outline-none transition"
                style={{
                    background: "color-mix(in srgb, var(--app-surface) 88%, transparent)",
                    borderColor: "var(--app-border)",
                    color: "var(--app-text-main)",
                }}
            />

            <button
                onClick={onSend}
                disabled={disabled}
                className="btn btn-primary rounded-2xl px-5 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {disabled ? "Sending..." : "Send"}
            </button>
        </div>
    );
};

export default SQLInput;