import GuestRow from "./GuestRow";
import { Pencil, Trash2 } from "lucide-react";
import type { Guest } from "@shared/types/guest";

interface Props {
  guests: Guest[];
  onEdit: (g: Guest) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function GuestTable({ 
  guests, 
  onEdit, 
  onDelete,
  isLoading,
}: Props) {
  return (
    <div>
      {/* MOBILE CARD VIEW */}
      <div className="block sm:hidden space-y-3 p-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-3 animate-pulse space-y-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))
        ) : guests.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 font-bold">No records found.</div>
        ) : (
          guests.map((g) => (
            <div key={g.id} className="group card p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Guest ID: {g.id.substring(0, 8)}</span>
                <div className="flex gap-2">
                  <button onClick={() => onEdit(g)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => onDelete(g.id)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-50 dark:border-slate-800/60 my-1" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-xs font-black text-sky-600">
                  {g.full_name[0]?.toUpperCase() || "G"}
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{g.full_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase">Email</span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold block truncate">{g.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase">Phone</span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold block">{g.phone || "—"}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-teal-50/50 dark:bg-teal-950/30 border-b border-teal-100/50 dark:border-teal-900/20">
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Email</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Phone</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-36">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 15 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50">
                    <td className="px-8 py-5 text-left"><div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-left"><div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-8 py-5 text-right w-36"><div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              : guests.map((g) => (
                  <GuestRow
                    key={g.id}
                    guest={g}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
