const Logo = () => {
    return(
        <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-300 flex item-center justify-center shadow-lg">
            <span className="text-white text-2xl">🏨</span>
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Hotel Flow </h1>
            <p className="text-sm text-gray-500">Booking Management System</p>
        </div>
        </div>    
    )
}
export default Logo;