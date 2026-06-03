import { useState } from "react";
import { useUpdateGuest } from "@shared/auth_hooks";
import type { Guest } from "@shared/types/guest";

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
    <div className="modal-overlay">
      <div className="modal-content w-full max-w-md p-6 space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Guest</h2>
          <button onClick={onClose} className="btn btn-ghost h-9 w-9 p-0">✕</button>
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
          <button onClick={onClose} className="btn btn-secondary px-3 py-2">
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isPending}
            className="btn btn-primary px-3 py-2"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}