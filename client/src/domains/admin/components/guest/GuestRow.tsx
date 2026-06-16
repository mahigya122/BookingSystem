import { Pencil, Trash2 } from "lucide-react";
import type { Guest } from "@shared/types/guest";

interface Props {
  guest: Guest;
  onEdit: (g: Guest) => void;
  onDelete: (id: string) => void;
}

export default function GuestRow({
  guest,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="group border-b border-slate-200/60 dark:border-slate-800/70 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">

      <td className="px-8 py-5 font-semibold text-slate-900 dark:text-white">{guest.full_name}</td>
      <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-300">{guest.email}</td>
      <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-300">{guest.phone}</td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-2 transition-all duration-300">
          <button
            onClick={() => onEdit(guest)}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900 shadow-sm transition-all"
            title="Edit Guest"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete(guest.id)}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-all"
            title="Delete Guest"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};