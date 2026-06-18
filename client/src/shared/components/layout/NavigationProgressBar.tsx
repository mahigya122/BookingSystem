import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavigationProgressBar = () => {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);
  const [isNavigating, setIsNavigating] = useState(false);

  // Derive navigating state directly from render cycle when path changes
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsNavigating(true);
  }

  useEffect(() => {
    // Only scroll to top if we're NOT targeting a specific section
    if (isNavigating && !location.state?.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    let timer: NodeJS.Timeout;
    if (isNavigating) {
      timer = setTimeout(() => {
        setIsNavigating(false);
      }, 500); // Progress bar duration
    }

    return () => clearTimeout(timer);
  }, [isNavigating, location.state]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ width: 0, opacity: 1 }}
          animate={{ width: "100%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 right-0 h-1 bg-sky-500 z-[9999] shadow-[0_0_10px_rgba(14,165,233,0.5)]"
        />
      )}
    </AnimatePresence>
  );
};

export default NavigationProgressBar;
