import {useState} from "react";
import { useUpdateCabin } from "../../authentication/useUpdateCabin";
import type { CabinData } from "../../services/apiCabins";
import type { Cabin } from "../../types/cabin";

interface Props {
    cabin: Cabin;
    onClose: () => void;
}

const EditCabinModal = ({ 
    cabin, 
    onClose
} : Props ) => {
    const { editCabin, isPending } = useUpdateCabin();

    const [form, setForm] = useState<CabinData>({
        name: cabin.name,
        capacity: cabin.capacity,
        price_per_night: cabin.price_per_night,
        discount: cabin.discount,
        image_url: cabin.image_url,
        description: cabin.description,
    });

    const handleSave = () => {
        editCabin({
            id: cabin.id,
            data: form,
        });

        onClose();
    };

 return(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-2xl space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Edit Cabin</h2>

                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-black"
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

            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border"
                >
                    Cancel
                </button>

                <button
                    disabled={isPending}
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
                >
                    {isPending ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    </div>
    
 );
};

export default EditCabinModal;