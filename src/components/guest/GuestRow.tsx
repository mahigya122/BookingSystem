import type { Guest } from "../../types/guest";

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
    <tr className="border-b">

      <td className="px-4 py-4">{guest.full_name}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{guest.email}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{guest.phone}</td>
      <td className="px-6 py-4">
      <div className="flex gap-2">

          <button
            onClick={() => onEdit(guest)}
            className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(guest.id)}
            className="px-2 py-1 bg-red-100 text-red-700 rounded"
          >
            Delete
          </button>

        </div>
      </td>
    </tr>
  );
};