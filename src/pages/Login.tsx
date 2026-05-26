import LoginForm from "../components/login/LoginForm";
import LoginHero from "../components/login/LoginHero";

const Login =() => {
  return(
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-50" style={{ background: "rgba(37,99,235,0.12)" }} />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full blur-3xl opacity-50" style={{ background: "rgba(229,9,20,0.10)" }} />
      <LoginHero />
    <div className="flex items-center justify-center px-6 relative z-10 bg-[color-mix(in_srgb,var(--app-bg)_90%,white_10%)] dark:bg-[color-mix(in_srgb,var(--app-bg)_92%,black_8%)]">  
      <LoginForm />
    </div>
    </div>
  )
}
export default Login;