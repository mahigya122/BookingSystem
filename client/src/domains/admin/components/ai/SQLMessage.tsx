import type { SQLMessage as SQLMessageType } from '@shared/types/sql';

type Props = SQLMessageType;

const SQLMessage = ({ role, content }: Props) => {
    const isUser = role === "user";

    return (
        <div
            className={`max-w-[82%] rounded-3xl border px-4 py-3 whitespace-pre-wrap text-[15px] leading-relaxed shadow-sm ${
                isUser
                    ? "ml-auto border-transparent text-white shadow-emerald-500/20"
                    : "shadow-black/10"
            }`}
            style={isUser ? {
                background: "linear-gradient(135deg, var(--app-primary) 0%, var(--app-secondary) 100%)",
            } : {
                background: "color-mix(in srgb, var(--app-surface-elevated) 90%, transparent)",
                borderColor: "var(--app-border)",
                color: "var(--app-text-main)",
            }}
        >
            {content}
        </div>
    );
};

export default SQLMessage;