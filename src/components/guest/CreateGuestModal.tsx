import { useState } from "react";
import { useCreateGuest } from "../../authentication/useCreateGuest";

interface Props {
  onClose: () => void;
}

export default function CreateGuestModal({ onClose }: Props) {
  const { addGuest, isPending } = useCreateGuest();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    if (!form.full_name || !form.email || !form.phone) return;

    addGuest(form, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Create Guest</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <input
          name="full_name"
          placeholder="Full name"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-3 py-2 bg-indigo-600 text-white rounded"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}