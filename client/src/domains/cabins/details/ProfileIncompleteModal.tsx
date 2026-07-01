import { AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileIncompleteModalProps {
    fullName: string | null;
    phone: string | null;
    onClose: () => void;
    bookingState?: any;
}

const ProfileIncompleteModal = ({ fullName, phone, onClose, bookingState }: ProfileIncompleteModalProps) => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800/80 animate-zoom-in text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                    <AlertCircle size={32} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Complete Profile First</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        You need to provide the following details before you can make a reservation:
                    </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex flex-col gap-2">
                    {!fullName && (
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                            <span className="h-2 w-2 rounded-full bg-rose-600 dark:bg-rose-400" />
                            Full Name is missing
                        </div>
                    )}
                    {!phone && (
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                            <span className="h-2 w-2 rounded-full bg-rose-600 dark:bg-rose-400" />
                            Phone Number is missing
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate("/profile", {
                            state: {
                                from: window.location.pathname + window.location.search,
                                bookingState
                            }
                        })}
                        className="w-full rounded-full bg-sky-500 py-4 font-black text-white hover:bg-sky-600 transition shadow-lg shadow-sky-200/50 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                        Go To Profile <ArrowRight size={18} />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-sm font-bold text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition cursor-pointer"
                    >
                        Not Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileIncompleteModal;
