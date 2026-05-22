import { useState } from "react";
import { useUpdateGuest } from "../../authentication/useUpdateGuest";
import type { Guest } from "../../types/guest";

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
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Guest</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}