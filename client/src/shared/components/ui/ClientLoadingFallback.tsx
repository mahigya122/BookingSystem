import { Mountain } from "lucide-react";

export const ClientLoadingFallback = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative flex flex-col items-center z-10">
        {/* Glow Ring and Icon */}
        <div className="relative flex items-center justify-center w-24 h-24 mb-6">
          {/* Pulsing Back Glow */}
          <div className="absolute inset-0 rounded-full bg-sky-500/10 dark:bg-sky-400/5 blur-xl animate-pulse" />
          
          {/* Animated Spinner Border */}
          <div className="absolute inset-0 rounded-full border-2 border-slate-100 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sky-500 border-r-sky-500 animate-spin" />
          
          {/* Mountain Icon (Pulsing and Floating) */}
          <div className="relative animate-bounce" style={{ animationDuration: '3s' }}>
            <Mountain className="h-10 w-10 text-sky-500 dark:text-sky-400 animate-pulse" />
          </div>
        </div>

        {/* Text and Info */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white leading-none">
            Cabin<span className="text-sky-500">Hub</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mt-2.5 mb-4 leading-none">
            Your Premium Getaway
          </p>

          {/* Sub loading text and progress bar */}
          <div className="flex flex-col items-center gap-2 w-48">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">
              Finding your sanctuary...
            </span>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLoadingFallback;
