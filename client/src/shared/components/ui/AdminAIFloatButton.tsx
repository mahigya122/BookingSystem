import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAIChat } from "../../../domains/admin/contexts/AIChatContext";

const AdminAIFloatButton = () => {
  const { open, setOpen } = useAIChat();
  const [showBubble, setShowBubble] = useState(false);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        left: -window.innerWidth + 120,
        right: 20,
        top: -window.innerHeight + 120,
        bottom: 20,
      });
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setShowBubble(true);
    }, 1200);

    const hideTimer = setTimeout(() => {
      setShowBubble(false);
    }, 9000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (open) return null;

  return (
    <motion.div
      drag
      dragConstraints={constraints}
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 cursor-grab active:cursor-grabbing select-none"
    >

      {/* ===================== */}
      {/* 💭 COMIC THOUGHT BUBBLE */}
      {/* ===================== */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{
              opacity: 1,
              scale: [0.6, 1.05, 1],
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="relative mr-2 flex flex-col items-end"
          >
            {/* Main Cloud */}
            <div className="relative bg-white dark:bg-slate-800 px-5 py-4 rounded-[2rem] shadow-2xl border border-sky-200 dark:border-sky-700 min-w-[180px] text-center">

              <p className="text-[13px] font-bold tracking-wide leading-relaxed text-slate-700 dark:text-slate-200">
                <span className="text-sky-500 font-black text-sm block mb-0.5">Admin Assistant ✨</span>
                How can I help you?
              </p>

              {/* Thought bubble pops */}
              <div className="absolute -bottom-3 right-6 w-5 h-5 bg-white dark:bg-slate-800 rounded-full border border-sky-200 dark:border-sky-700" />
              <div className="absolute -bottom-5 right-3 w-3 h-3 bg-white dark:bg-slate-800 rounded-full border border-sky-200 dark:border-sky-700" />
              <div className="absolute -bottom-7 right-8 w-2 h-2 bg-white dark:bg-slate-800 rounded-full border border-sky-200 dark:border-sky-700" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== */}
      {/* 🤖 FLOATING AI BUTTON */}
      {/* ===================== */}
      <button
        onClick={() => {
          setOpen(true);
          setShowBubble(false);
        }}
        className="
          relative
          group
          flex
          items-center justify-center
          hover:-translate-y-1
          active:scale-95
          transition-all duration-300
        "
        title="Chat with AI"
      >
        {/* 🤖 Cute Chatbot icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
          alt="AI Assistant"
          className="
            relative z-10
            w-16 h-16 md:w-20 md:h-20
            object-contain
            drop-shadow-[0_8px_16px_rgba(56,189,248,0.4)]
            group-hover:drop-shadow-[0_12px_24px_rgba(56,189,248,0.6)]
            group-hover:scale-110
            transition-all duration-300
          "
        />

        {/* 🟢 Online dot */}
        <div
          className="
            absolute top-1 right-1 z-20
            h-3.5 w-3.5
            rounded-full
            bg-emerald-400
            border-2 border-white dark:border-slate-900
            animate-pulse
          "
        />
      </button>
    </motion.div>
  );
};

export default AdminAIFloatButton;
