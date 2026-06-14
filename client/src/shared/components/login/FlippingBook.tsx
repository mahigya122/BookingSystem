import { useMemo } from "react";
import type { AuthUser } from "../../types/auth";

import LoginForm from "./LoginForm";
import LoginHero from "./LoginHero";

type Role = "admin" | "user";

type Props = {
  role: Role;
  onRoleChange: (role: Role) => void;
  onLoginSuccess: (result: { user: AuthUser }) => void;
  hideToggle?: boolean;
};

const toggleButtonClass = (active: boolean) =>
  `rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${active
    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-[1.02]"
    : "text-slate-400 hover:text-slate-900 dark:text-slate-350 dark:hover:text-white"
  }`;

const FlippingBook = ({ role, onRoleChange, onLoginSuccess, hideToggle }: Props) => {
  const isUser = role === "user";

  const title = useMemo(
    () => (isUser ? "CabinHub" : "CabinHub Manager"),
    [isUser]
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-cyan-50 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white flex items-center">
      {/* Dashed circle decorations in bg */}
      <svg className="absolute -top-20 -left-20 w-80 h-80 text-sky-200/30 dark:text-sky-900/10 pointer-events-none" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" />
      </svg>
      <svg className="absolute -bottom-20 -right-20 w-80 h-80 text-cyan-200/30 dark:text-cyan-900/10 pointer-events-none" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" />
      </svg>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(14,165,233,0.1), transparent 30%), radial-gradient(circle at bottom right, rgba(6,182,212,0.08), transparent 28%)",
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-linear-to-b from-transparent via-sky-200/40 to-transparent lg:block" />

      <div className="relative mx-auto flex min-h-screen w-full flex-col justify-center px-0 py-0">
        <div className="mb-4 flex items-center justify-between px-6 text-sm font-semibold text-slate-600 dark:text-slate-350 lg:hidden">
          <span className="font-black text-2xl tracking-tight">Cabin<span className="text-sky-500">Hub</span></span>
          <span className="rounded-full border border-sky-100/50 bg-white/60 px-4 py-1.5 text-[12px] uppercase tracking-[0.2em] dark:border-slate-800 dark:bg-slate-900/60 text-sky-600 font-bold">
            {isUser ? "Guest View" : "Admin View"}
          </span>
        </div>

        <div className="hidden items-center justify-center lg:flex h-screen w-full">
          <div className="relative w-full h-full overflow-hidden border-none bg-white/40 backdrop-blur-3xl dark:bg-slate-950/40 shadow-none">
            <div
              className="relative w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                perspective: "2000px",
                transformStyle: "preserve-3d",
                transform: isUser ? "rotateY(0deg)" : "rotateY(-180deg)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="grid h-full grid-cols-2">
                  <div className="flex items-center justify-center border-r border-sky-100/30 bg-white/60 px-8 dark:border-slate-800/30 dark:bg-slate-950/60 lg:px-20">
                    <LoginForm role="user" onLoginSuccess={onLoginSuccess} />
                  </div>

                  <div className="bg-sky-50/10 dark:bg-slate-900/10 flex items-center justify-center">
                    <LoginHero role="user" />
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="grid h-full grid-cols-2">
                  <div className="bg-sky-50/10 dark:bg-slate-900/10 flex items-center justify-center">
                    <LoginHero role="admin" />
                  </div>

                  <div className="flex items-center justify-center border-l border-sky-100/30 bg-white/60 px-8 dark:border-slate-800/30 dark:bg-slate-950/60 lg:px-20">
                    <LoginForm role="admin" onLoginSuccess={onLoginSuccess} />
                  </div>
                </div>
              </div>
            </div>

            {!hideToggle && (
              <div className="absolute left-1/2 bottom-12 z-30 -translate-x-1/2">
                <div className="rounded-full border border-sky-100/50 bg-white/90 p-1.5 shadow-2xl shadow-sky-500/10 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
                  <button
                    type="button"
                    onClick={() => onRoleChange("user")}
                    aria-pressed={isUser}
                    className={toggleButtonClass(isUser)}
                  >
                    Guest Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => onRoleChange("admin")}
                    aria-pressed={!isUser}
                    className={toggleButtonClass(!isUser)}
                  >
                    Operations Admin
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="overflow-hidden rounded-[2rem] border border-sky-150 bg-white/70 shadow-2xl shadow-sky-200/50 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-sky-50/70 px-5 py-4 dark:border-slate-800">
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-sky-500">
                  {isUser ? "Guest login" : "Admin login"}
                </p>
                <h1 className="text-xl font-black">{title}</h1>
              </div>
              <div className="rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
                {isUser ? "Cabin Booking" : "Operations"}
              </div>
            </div>

            {!hideToggle && (
              <div className="flex flex-wrap gap-2 border-b border-sky-50/70 px-5 py-4 dark:border-slate-800">
                <button type="button" onClick={() => onRoleChange("user")} className={toggleButtonClass(isUser)}>
                  User
                </button>
                <button type="button" onClick={() => onRoleChange("admin")} className={toggleButtonClass(!isUser)}>
                  Admin
                </button>
              </div>
            )}

            <div className="grid gap-0 lg:hidden">
              {isUser ? (
                <>
                  <div className="border-b border-sky-50/50 bg-sky-50/10 dark:border-slate-800 dark:bg-slate-900/50">
                    <LoginHero role="user" />
                  </div>
                  <div className="bg-white/80 px-5 py-6 dark:bg-slate-950">
                    <LoginForm role="user" onLoginSuccess={onLoginSuccess} />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-sky-50/50 bg-sky-50/10 dark:border-slate-800 dark:bg-slate-900/50">
                    <LoginHero role="admin" />
                  </div>
                  <div className="bg-white/80 px-5 py-6 dark:bg-slate-950">
                    <LoginForm role="admin" onLoginSuccess={onLoginSuccess} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlippingBook;