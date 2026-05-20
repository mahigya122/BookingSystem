import Logo from "./Logo";

const LoginHero = () => {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-indigo-300 text-white p-12">
      <div>
        <Logo />

        <div className="mt-20 space-y-6">
          <h2 className="text-5xl font-bold leading-tight">
            Manage bookings
            <br />
            smarter & faster.
          </h2>

          <p className="text-indigo-100 text-lg leading-relaxed max-w-md">
            Powerful hotel management platform
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
          <h3 className="text-3xl font-bold">120+</h3>
          <p className="text-indigo-100 mt-1">Bookings managed</p>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
          <h3 className="text-3xl font-bold">98%</h3>
          <p className="text-indigo-100 mt-1">Customer satisfaction</p>
        </div>
      </div>
    </div>
  );
};

export default LoginHero;