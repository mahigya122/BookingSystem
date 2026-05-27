import Logo from "./Logo";

type Props = { role?: 'admin' | 'user' };

const LoginHero = ({ role = 'admin' }: Props) => {
  const isUser = role === 'user';

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden px-6 py-8 text-slate-900 lg:px-12 lg:py-12 dark:text-white">
      <div className="absolute inset-0 opacity-100">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(255,255,255,0.45), transparent 30%), radial-gradient(circle at bottom left, rgba(29,78,216,0.10), transparent 28%)",
          }}
        />
        <div
          className="absolute inset-0 dark:hidden"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0))" }}
        />
        <div
          className="absolute inset-0 hidden dark:block"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))" }}
        />
      </div>

      <div className="relative z-10">
        <Logo />

        <div className="mt-14 max-w-xl space-y-5 lg:mt-20">
          <span className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800 shadow-sm dark:border-emerald-900/50 dark:bg-slate-950/60 dark:text-emerald-200">
            {isUser ? 'Guest experience' : 'Hotel operations'}
          </span>

          <div className="space-y-3">
            <h2 className="max-w-lg text-4xl font-black leading-tight tracking-tight lg:text-5xl">
              {isUser ? 'Welcome to Hotelook' : 'Manage with clarity'}
            </h2>
            <p className="max-w-xl text-base leading-7 text-slate-700 lg:text-lg dark:text-slate-300">
              {isUser
                ? 'Find the best rooms, check your booking status, and enjoy a calm, friendly booking flow.'
                : 'Keep bookings, guests, and cabins organized from one calm, efficient dashboard.'}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:-ml-2 ">
            <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {isUser ? 'Easy bookings' : 'Live operations'}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {isUser ? 'Find rooms quickly, see booking status, and sign in in seconds.' : 'Monitor guests, cabins, and performance without switching screens.'}
              </p>
            </div>

              <div className="rounded-2xl border border-white/70 bg-white/75 p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-950/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {isUser ? 'Personalised stays' : 'Management ready'}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
                {isUser ? 'A friendly booking flow that feels simple and calm.' : 'A compact workspace for fast, focused management.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_16px_60px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950/70 lg:mt-0">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-emerald-700/90" />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{isUser ? 'Alex Mitchell' : 'Olivia Carter'}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{isUser ? 'Amsterdam' : 'Hotel Manager'}</p>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">
          {isUser
            ? '“The booking flow feels simple and polished. It is easy to find the right room and continue quickly.”'
            : '“The admin view is compact, clear, and keeps every important control close at hand.”'}
        </p>

        <div className="mt-5 flex items-end justify-between">
          <div className="space-y-1">
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default LoginHero;