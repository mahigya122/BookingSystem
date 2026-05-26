const Logo = () => {
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <span className="text-white text-2xl font-black">H</span>
            </div>
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Hotel Flow</h1>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-1">Management Suite</p>
            </div>
        </div>    
    );
};

export default Logo;
