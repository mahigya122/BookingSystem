import { useMemo } from "react";

import LoginForm from "./LoginForm";
import LoginHero from "./LoginHero";

type Role = "admin" | "user";

type Props = {
  role: Role;
  onRoleChange: (role: Role) => void;
  onLoginSuccess: () => void;
};

const toggleButtonClass = (active: boolean) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${active
    ? "bg-emerald-700 text-white shadow-lg shadow-emerald-800/20"
    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
  }`;

const FlippingBook = ({ role, onRoleChange, onLoginSuccess }: Props) => {
  const isUser = role === "user";

  const title = useMemo(
    () => (isUser ? "Welcome to Hotelook" : "Hotelook Management"),
    [isUser]
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f3f0e5] text-slate-900 dark:bg-slate-950 dark:text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(32,92,67,0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(229,115,20,0.12), transparent 28%)",
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-linear-to-b from-transparent via-slate-300/60 to-transparent lg:block" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-400 flex-col justify-center px-3 py-3 lg:px-4 lg:py-4">
        <div className="mb-4 flex items-center justify-between px-2 text-sm font-semibold text-slate-600 dark:text-slate-300 lg:hidden">
          <span>{title}</span>
          <span className="rounded-full border border-slate-300/70 bg-white/60 px-3 py-1 text-[11px] uppercase tracking-[0.2em] dark:border-slate-700 dark:bg-slate-900/60">
            {isUser ? "Guest view" : "Admin view"}
          </span>
        </div>

        <div className="hidden items-center justify-center lg:flex">
          <div className="relative w-full overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/70 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/75">
            <div
              className="relative w-full transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                perspective: "1600px",
                transformStyle: "preserve-3d",
                transform: isUser ? "rotateY(0deg)" : "rotateY(-180deg)",
                height: "calc(100vh - 2rem)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="grid h-full grid-cols-2">
                  <div className="flex items-center justify-center border-r border-slate-200/80 bg-[#f6f2e8] px-8 dark:border-slate-800 dark:bg-slate-950 lg:px-12">
                    <LoginForm role="user" onLoginSuccess={onLoginSuccess} />
                  </div>

                  <div className="bg-[#f9f7ef] dark:bg-[#0b1120]">
                    <LoginHero role="user" />
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="grid h-full grid-cols-2">
                  <div className="bg-[#f9f7ef] dark:bg-[#0b1120]">
                    <LoginHero role="admin" />
                  </div>

                  <div className="flex items-center justify-center border-l border-slate-200/80 bg-[#f6f2e8] px-8 dark:border-slate-800 dark:bg-slate-950 lg:px-12">
                    <LoginForm role="admin" onLoginSuccess={onLoginSuccess} />
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-6 z-30 -translate-x-1/2">
              <div className="rounded-full border border-slate-200/80 bg-white/90 p-1 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-950/90">
                <button
                  type="button"
                  onClick={() => onRoleChange("user")}
                  aria-pressed={isUser}
                  className={toggleButtonClass(isUser)}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => onRoleChange("admin")}
                  aria-pressed={!isUser}
                  className={toggleButtonClass(!isUser)}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.1)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
            <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-300">
                  {isUser ? "Guest login" : "Admin login"}
                </p>
                <h1 className="text-lg font-black">{title}</h1>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                {isUser ? "Room booking" : "Operations"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200/70 px-5 py-4 dark:border-slate-800">
              <button type="button" onClick={() => onRoleChange("user")} className={toggleButtonClass(isUser)}>
                User
              </button>
              <button type="button" onClick={() => onRoleChange("admin")} className={toggleButtonClass(!isUser)}>
                Admin
              </button>
            </div>

            <div className="grid gap-0 lg:hidden">
              {isUser ? (
                <>
                  <div className="border-b border-slate-200/70 bg-[#f9f7ef] dark:border-slate-800 dark:bg-slate-900">
                    <LoginHero role="user" />
                  </div>
                  <div className="bg-[#f6f2e8] px-5 py-6 dark:bg-slate-950">
                    <LoginForm role="user" onLoginSuccess={onLoginSuccess} />
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b border-slate-200/70 bg-[#f9f7ef] dark:border-slate-800 dark:bg-slate-900">
                    <LoginHero role="admin" />
                  </div>
                  <div className="bg-[#f6f2e8] px-5 py-6 dark:bg-slate-950">
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