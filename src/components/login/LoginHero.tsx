import Logo from "./Logo";

const LoginHero = () => {
  return (
    <div
      className="hidden lg:flex flex-col justify-between text-white p-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #050816 0%, #0b1120 45%, #050816 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(229,9,20,0.18)" }} />
        <div className="absolute top-28 right-16 h-56 w-56 rounded-full blur-3xl" style={{ background: "rgba(245,158,11,0.12)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.09) 1px, transparent 0)', backgroundSize: '36px 36px' }} />
      </div>

      <div className="relative z-10">
        <Logo />

        <div className="mt-24 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-300">
            Premium hotel operations
          </div>

          <h2 className="text-5xl font-black leading-tight tracking-tight">
            Comprehensive Hotel
            <br />
            <span style={{ color: "#f59e0b" }}>Management</span> Solutions.
          </h2>

          <p className="text-slate-300 text-lg leading-relaxed max-w-md font-medium">
            Optimize your operations, increase occupancy, and deliver exceptional guest experiences with our unified platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px rounded-2xl overflow-hidden relative z-10 border border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="p-8" style={{ background: "rgba(10, 15, 28, 0.9)" }}>
          <h3 className="text-3xl font-black">2.4k+</h3>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">Properties Managed</p>
        </div>

        <div className="p-8" style={{ background: "rgba(10, 15, 28, 0.9)" }}>
          <h3 className="text-3xl font-black">99.9%</h3>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">System Uptime</p>
        </div>
      </div>
    </div>
  );
};

export default LoginHero;