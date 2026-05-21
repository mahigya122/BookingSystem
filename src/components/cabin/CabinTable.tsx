import CabinRow from "./CabinRow";
import type { Cabin } from "../../types/cabin";

interface Props{
    cabins: Cabin[];
    onEdit: (cabin: Cabin) => void;
    onDelete: (id: string) => void;
     onView: (cabin: Cabin) => void;
}

const CabinTable = ({
    cabins,
    onEdit,
    onDelete,
    onView,
}: Props) => {

return(
    <div className="bg-white rounded-xl shadow overflow-hidden">

    <table className="w-full border-collapse">

        <thead className="bg-gray-50 border-b">
            <tr>
                <th className="px-6 py-4 text-left"> Image </th>
                <th className="px-6 py-4 text-left"> Name</th>
                <th className="px-6 py-4 text-left"> Capacity </th>
                <th className="px-6 py-4 text-left"> Price / Night </th>
                <th className="px-6 py-4 text-left"> Discount </th>
                <th className="pl-6 pr-3 py-4 text-left"> Actions </th>
            </tr>
        </thead>

        <tbody>    
            {cabins.map((cabin) => (
                <CabinRow
                key= {cabin.id}
                cabin= {cabin}
                onEdit= {onEdit}
                onDelete= {onDelete}
                onView= {onView}
                />
            ))}
        </tbody>
        
      </table>
    </div>
        );
};

export default CabinTable;

        