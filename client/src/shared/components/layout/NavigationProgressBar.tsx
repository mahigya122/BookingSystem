import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavigationProgressBar = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    
    // Only scroll to top if we're NOT targeting a specific section
    if (!location.state?.scrollTo) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500); // Progress bar duration

    return () => clearTimeout(timer);
  }, [location.pathname, location.state]);

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
