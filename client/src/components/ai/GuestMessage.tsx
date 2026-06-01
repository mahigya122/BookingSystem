interface Props {
    role: "user" | "assistant";
    content: string;
}

const GuestMessage = ({ role, content }: Props) => {
    const isUser = role === "user";

    return (
        <div
            className={`max-w-[82%] rounded-3xl border px-4 py-3 whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm ${isUser
                    ? "ml-auto border-transparent text-white shadow-emerald-500/20"
                    : "shadow-black/10"
                }`}
            style={
                isUser
                    ? {
                        background:
                            "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                    }
                    : {
                        background:
                            "color-mix(in srgb, var(--app-surface-elevated) 90%, transparent)",
                        borderColor: "var(--app-border)",
                        color: "var(--app-text-main)",
                    }
            }
        >
            {content}
        </div>
    );
};

export default GuestMessage;