import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

interface Props {
    role: "user" | "assistant";
    content: string;
    userInitials?: string;
}

const GuestMessage = ({ role, content, userInitials }: Props) => {
    const isUser = role === "user";

    return (
        <div className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
            {/* AI Avatar (left side of AI message) */}
            {!isUser && (
                <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shrink-0 shadow-sm border border-white/20 dark:border-slate-800"
                    aria-hidden="true"
                >
                    <Bot size={16} strokeWidth={2} />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`max-w-[75%] rounded-[1.5rem] border px-4 py-3 whitespace-pre-wrap text-[14px] leading-relaxed shadow-sm`}
                style={
                    isUser
                        ? {
                            background:
                                "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
                            borderColor: "transparent",
                            color: "white",
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

            {/* User Avatar (right side of User message) */}
            {isUser && (
                <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-400 to-sky-500 text-white shrink-0 shadow-sm border border-white/20 dark:border-slate-800"
                    aria-label="Your Profile Picture"
                >
                    {userInitials && userInitials !== "G" ? (
                        <span className="font-extrabold text-[11px] uppercase tracking-wider">{userInitials}</span>
                    ) : (
                        <User size={15} strokeWidth={2} />
                    )}
                </div>
            )}
        </div>
    );
};

export default GuestMessage;
