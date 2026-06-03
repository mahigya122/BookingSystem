import { useState } from "react";
import { useCreateCabin } from "@shared/auth_hooks";
import type { CabinData } from "@shared/services/apiCabins";

interface Props {
    onClose: () => void;
}

const CreateCabinModal = ({ onClose } : Props) => {
    const { addCabin, isPending } = useCreateCabin();

    const [form, setForm] = useState<CabinData>({
        name: "",
        capacity: 1,
        price_per_night: 0,
        discount: 0,
        image_url: "",
        description: "",
    });

    const handleSubmit = () => {
        addCabin(form, {
            onSuccess: () => {
                onClose();
            },
        });
    };

return (
    <div className="modal-overlay">

            <div className="modal-content w-full max-w-2xl space-y-5 p-6">

                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">
                        Create Cabin
                    </h2>

                    <button
                        onClick={onClose}
                        className="btn btn-ghost h-9 w-9 p-0"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Name</label>
                        <input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Capacity</label>
                        <input
                            type="number"
                            value={form.capacity}
                            onChange={(e) =>
                                setForm({ ...form, capacity: Number(e.target.value) })
                            }
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Price per Night</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={String(form.price_per_night)}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    price_per_night: Number(e.target.value),
                                })
                            }
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-600">Discount</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={String(form.discount)}
                            onChange={(e) =>
                                setForm({ ...form, discount: Number(e.target.value) })
                            }
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-gray-600">Image URL</label>
                        <input
                            value={form.image_url}
                            onChange={(e) =>
                                setForm({ ...form, image_url: e.target.value })
                            }
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm text-gray-600">Description</label>
                        <textarea
                            value={form.description || ""}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                            className="w-full border rounded-lg p-2 min-h-28"
                        />
                    </div>
                </div>

                <div className= "flex justify-end gap-3">

                <button
                onClick={onClose}
                className="btn btn-secondary px-4 py-2"
                >
                        Cancel
                </button>

                <button
                onClick={handleSubmit}
                disabled={isPending}
                className="btn btn-primary px-4 py-2"
                >
                        {isPending ? "Saving..." : "Save"}
                </button>

                </div>
    </div>
</div>    
);  
};
export default CreateCabinModal;