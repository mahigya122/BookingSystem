import type { Guest } from "../../../shared/types/guest";

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
    <tr className="border-b border-slate-200/60 dark:border-slate-800/70">

      <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">{guest.full_name}</td>
      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">{guest.email}</td>
      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-300">{guest.phone}</td>
      <td className="px-6 py-4">
      <div className="flex gap-2">

          <button
            onClick={() => onEdit(guest)}
            className="btn-action btn-action-primary"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(guest.id)}
            className="btn-action btn-action-danger"
          >
            Delete
          </button>

        </div>
      </td>
    </tr>
  );
};