import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { useClientAIChat } from "../../../domains/guests/ClientAIChatContext";

const AIFloatButton = () => {
  const { open, setOpen } = useClientAIChat();
  const [showBubble, setShowBubble] = useState(false);
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 });
  const isDraggingRef = useRef(false);

  // Load initial position from localStorage and clamp it to the current viewport constraints
  const getInitialPosition = () => {
    const saved = localStorage.getItem("guest-ai-float-position");
    if (saved) {
      try {
        const { x, y } = JSON.parse(saved);
        const maxLeft = -window.innerWidth + 120;
        const maxRight = 20;
        const maxTop = -window.innerHeight + 120;
        const maxBottom = 20;
        return {
          x: Math.max(maxLeft, Math.min(maxRight, x)),
          y: Math.max(maxTop, Math.min(maxBottom, y)),
        };
      } catch (e) {}
    }
    return { x: 0, y: 0 };
  };

  const initialPos = getInitialPosition();
  const x = useMotionValue(initialPos.x);
  const y = useMotionValue(initialPos.y);

  useEffect(() => {
    const updateConstraints = () => {
      const maxLeft = -window.innerWidth + 120;
      const maxRight = 20;
      const maxTop = -window.innerHeight + 120;
      const maxBottom = 20;

      setConstraints({
        left: maxLeft,
        right: maxRight,
        top: maxTop,
        bottom: maxBottom,
      });

      // Keep current position bounded on resize
      x.set(Math.max(maxLeft, Math.min(maxRight, x.get())));
      y.set(Math.max(maxTop, Math.min(maxBottom, y.get())));
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [x, y]);

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
      style={{ x, y }}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onTap={() => {
        if (isDraggingRef.current) return;
        setOpen(true);
        setShowBubble(false);
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 100);
        localStorage.setItem(
          "guest-ai-float-position",
          JSON.stringify({ x: x.get(), y: y.get() })
        );
      }}
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
                <span className="text-sky-500 font-black text-sm block mb-0.5">Hello!</span>
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
      {/* FLOATING AI BUTTON */}
      {/* ===================== */}
      <div
        className="
          relative
          group
          flex
          items-center justify-center
          hover:-translate-y-1
          active:scale-95
          transition-all duration-300
          cursor-pointer
        "
        title="Chat with AI"
      >
        {/* Cute Chatbot icon */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/8943/8943377.png"
          alt="AI Assistant"
          draggable="false"
          className="
            relative z-10
            w-12 h-12 md:w-20 md:h-20
            object-contain
            drop-shadow-[0_8px_16px_rgba(56,189,248,0.4)]
            group-hover:drop-shadow-[0_12px_24px_rgba(56,189,248,0.6)]
            group-hover:scale-110
            transition-all duration-300
          "
        />

        {/*  Online dot */}
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
      </div>
    </motion.div>
  );
};

export default AIFloatButton;