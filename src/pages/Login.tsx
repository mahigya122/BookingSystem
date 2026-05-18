import LoginForm from "../components/auth/LoginForm";
import LoginHero from "../components/loginLayout/LoginHero";

const Login =() => {
  return(
    <div className="min-h-screen grid lg:grid-cols-2">
      <LoginHero />
    <div className="flex items-center justify-center bg-gray-50 px-6">  
      <LoginForm />
    </div>
    </div>
  )
}
export default Login;