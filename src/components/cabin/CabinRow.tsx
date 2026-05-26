import type { Cabin } from "../../types/cabin";

interface Props {
    cabin: Cabin;
    onEdit: (cabin: Cabin) => void;
    onDelete: (id: string) => void;
    onView: (cabin: Cabin) => void;
}

const CabinRow = ({
    cabin,
    onEdit,
    onDelete,
    onView,
}: Props) => {

    return (
        <tr className="group">
            <td className="px-6 py-4">
                <img
                    src={cabin.image_url}
                    alt= {cabin.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                />
            </td>

            <td className="px-6 py-4">
                <span className="font-bold text-slate-900 dark:text-slate-100">{cabin.name}</span>
            </td>

            <td className= "px-6 py-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {cabin.capacity} Guest{cabin.capacity > 1 ? 's' : ''}
                </span>
            </td>

            <td className= "px-6 py-4 font-black text-slate-900 dark:text-white">
                ${cabin.price_per_night.toLocaleString()}
            </td>

            <td className="px-6 py-4">
                {cabin.discount > 0 ? (
                    <span className="badge badge-success">-{cabin.discount}%</span>
                ) : (
                    <span className="text-xs font-bold text-slate-300">N/A</span>
                )}
            </td>


            <td className="px-6 py-4">
                <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                    <button
                        onClick={() => onView(cabin)}
                        className="btn-action btn-action-secondary"
                    >
                       View
                    </button>

                    <button
                        onClick= {() => onEdit(cabin)}
                        className="btn-action btn-action-primary"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(cabin.id)}
                        className="btn-action btn-action-danger"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};
export default CabinRow;
