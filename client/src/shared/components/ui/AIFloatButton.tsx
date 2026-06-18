import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientAIChat } from "../../../domains/guests/contexts/ClientAIChatContext";

const AIFloatButton = () => {
  const { open, setOpen } = useClientAIChat();
  const [showBubble, setShowBubble] = useState(false);

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
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">

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

              <p className="text-xs font-black uppercase tracking-widest leading-relaxed text-slate-900 dark:text-white">
                Ask me if you <br />
                <span className="text-sky-500">need help!</span>
              </p>

              {/* Cloud bumps (comic style) */}
              <div className="absolute -bottom-3 right-6 w-6 h-6 bg-white dark:bg-slate-800 rounded-full border border-sky-200 dark:border-sky-700" />
              <div className="absolute -bottom-5 right-3 w-4 h-4 bg-white dark:bg-slate-800 rounded-full border border-sky-200 dark:border-sky-700" />
              <div className="absolute -bottom-6 right-10 w-3 h-3 bg-white dark:bg-slate-800 rounded-full border border-sky-200 dark:border-sky-700" />
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
          flex h-14 w-14 md:h-16 md:w-16
          items-center justify-center

          rounded-2xl

          bg-gradient-to-br from-sky-500 via-cyan-400 to-blue-500
          dark:from-sky-400 dark:to-cyan-300

          text-white

          border border-white/20

          shadow-[0_10px_30px_rgba(56,189,248,0.45)]
          hover:shadow-[0_20px_60px_rgba(56,189,248,0.65)]

          hover:-translate-y-1
          transition-all duration-300
        "
      >
        {/* 🔵 Glow halo */}
        <div className="absolute inset-0 rounded-2xl bg-sky-400/40 blur-2xl animate-pulse" />

        {/* 🌐 Outer ring pulse */}
        <div className="absolute inset-[-10px] rounded-[1.4rem] border border-sky-300/40 animate-ping opacity-30" />

        {/* 🤖 Bot icon */}
        <Bot
          size={26}
          className="
            relative z-10
            group-hover:scale-110
            transition-transform duration-300
          "
        />

        {/* 🟢 Online dot */}
        <div
          className="
            absolute -top-1 -right-1
            h-3.5 w-3.5
            rounded-full
            bg-emerald-400
            border-2 border-white dark:border-slate-900
            animate-pulse
          "
        />
      </button>
    </div>
  );
};

export default AIFloatButton;