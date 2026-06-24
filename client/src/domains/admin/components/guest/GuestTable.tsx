import GuestRow from "./GuestRow";
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
    <table className="w-full">

        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            <th className="px-8 py-5 text-left">Full Name</th>
            <th className="px-8 py-5 text-left">Email</th>
            <th className="px-8 py-5 text-left">Phone</th>
            <th className="px-8 py-5 text-right w-36">Actions</th>
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
  );
};
