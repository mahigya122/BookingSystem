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
        <tr className=" hover:bg-gray-50">
            <td className="px-6 py-4">
                <img
                src={cabin.image_url}
                alt= {cabin.name}
                className="w-16 h-16 rounded-lg object-cover"
                />
            </td>

            <td className="px-6 py-4">{cabin.name}</td>
            <td className= "px-6 py-4">{cabin.capacity}</td>
            <td className= "px-6 py-4">${cabin.price_per_night}</td>
            <td className="px-6 py-4">{cabin.discount}%</td>


            <td className="pl-6 pr-3 py-4">
                <div className="flex gap-2">

                    <button
                    onClick= {() => onEdit(cabin)}
                    className= "px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg  hover:bg-gray-200"
                    >
                        Edit
                    </button>

                    <button
                    onClick={() => onDelete(cabin.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg  hover:bg-gray-200"
                   >
                        Delete
                    </button>

                    <button
                    onClick={() => onView(cabin)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-gray-200"
                >
                       Details
                 </button>
                </div>
            </td>
        </tr>
    );
};
export default CabinRow;