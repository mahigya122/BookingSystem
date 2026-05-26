import GuestRow from "./GuestRow";
import type { Guest } from "../../types/guest";

interface Props {
  guests: Guest[];
  onEdit: (g: Guest) => void;
  onDelete: (id: string) => void;
}

export default function GuestTable({ 
  guests, 
  onEdit, 
  onDelete 
}: Props) {
  return (
    <table className="w-full">

        <thead>
          <tr className="border-b">
            <th className="px-6 py-4 text-left">Full Name</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-left">Phone</th>
            <th className="px-6 py-4 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {guests.map((g) => (
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