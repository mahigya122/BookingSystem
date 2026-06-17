import { useState } from "react";
import { useUpdateGuest } from "@shared/hooks";
import type { Guest } from "@shared/types/guest";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Save, 
  Loader2, 
  ArrowLeft,
  ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  guest: Guest;
  onClose: () => void;
}

export default function EditGuestModal({ guest, onClose }: Props) {
  const { updateGuest, isPending } = useUpdateGuest();

  const [form, setForm] = useState({
    id: guest.id,
    full_name: guest.full_name,
    email: guest.email,
    phone: guest.phone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    if (!form.full_name.trim()) {
        toast.error("Full name is required");
        return;
    }

    updateGuest(
      {
        id: form.id,
        guest: {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
        },
      },
      {
        onSuccess: () => {
          toast.success("Guest updated successfully");
          onClose();
        },
      }
    );
  };

  const inputLabelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block";
  const inputBaseClass = "w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 outline-none transition-all dark:text-white";

  return (
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Guest Record</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate max-w-[240px]">Record ID: {guest.id.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 bg-slate-50/30 dark:bg-slate-950/30 space-y-8">
            <div className="flex items-center gap-6 p-6 surface-panel rounded-[2rem]">
                <div className="h-20 w-20 rounded-[1.5rem] bg-sky-500/10 flex items-center justify-center text-sky-500 text-3xl font-black">
                    {form.full_name?.charAt(0) || "G"}
                </div>
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Profile Identity</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Update basic contact information and identity details for this guest record.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className={inputLabelClass}>Legal Full Name</label>
                    <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            name="full_name"
                            value={form.full_name}
                            onChange={handleChange}
                            className={`${inputBaseClass} pl-12`}
                            placeholder="e.g. Johnathan Doe"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className={inputLabelClass}>Electronic Mail</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`${inputBaseClass} pl-12`}
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className={inputLabelClass}>Contact Phone</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                className={`${inputBaseClass} pl-12`}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-sky-50/50 dark:bg-sky-900/10 rounded-3xl border border-sky-100/50 dark:border-sky-900/20 flex items-start gap-4">
                <ShieldCheck size={20} className="text-sky-500 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-xs font-black text-sky-700 dark:text-sky-400 uppercase tracking-widest">Data Integrity</p>
                    <p className="text-xs font-medium text-sky-600/80 dark:text-sky-500/80 leading-relaxed">
                        Changes to guest information are permanent and will reflect across all future and current reservations linked to this profile.
                    </p>
                </div>
            </div>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="btn btn-secondary px-6 font-black uppercase tracking-widest text-[10px]">
            Discard Changes
          </button>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="btn btn-primary px-10 shadow-xl shadow-sky-500/20"
          >
            {isPending ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Update Guest</>}
          </button>
        </div>
      </div>
    </div>
  );
}
