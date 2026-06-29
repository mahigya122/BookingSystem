import { motion } from "framer-motion";

interface Props {
    role: "user" | "assistant";
    content: string;
}

const GuestMessage = ({ role, content }: Props) => {
    const isUser = role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`max-w-[85%] rounded-[1.5rem] border px-4 py-3 whitespace-pre-wrap text-[14px] leading-relaxed shadow-sm ${isUser
                    ? "ml-auto border-transparent text-white shadow-sky-500/10"
                    : "shadow-black/5"
                }`}
            style={
                isUser
                    ? {
                        background:
                            "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
                    }
                    : {
                        background:
                            "color-mix(in srgb, var(--app-surface-elevated) 95%, white)",
                        borderColor: "var(--app-border)",
                        color: "var(--app-text-main)",
                        backdropFilter: "blur(12px)",
                    }
            }
        >
            {content}
        </motion.div>
    );
};

export default GuestMessage;
