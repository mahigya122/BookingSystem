import CabinRow from "./CabinRow";
import type { Cabin } from "../../types/cabin";

interface Props{
    cabins: Cabin[];
    onEdit: (cabin: Cabin) => void;
    onDelete: (id: string) => void;
}

const CabinTable = ({
    cabins,
    onEdit,
    onDelete,
}: Props) => {

return(
    <div className="bg-white rounded-xl shadow overflow-x-auto">

      <table className="w-full">

        <thead className="bg-gray-50 border-b">
            <tr>
                <th className="px-6 py-4 text-left"> Image </th>
                <th className="px-6 py-4 text-left"> Name</th>
                <th className="px-6 py-4 text-left"> Capacity </th>
                <th className="px-6 py-4 text-left"> Price / Night </th>
                <th className="px-6 py-4 text-left"> Discount </th>
                <th className="px-6 py-4 text-left"> Actions </th>
            </tr>
        </thead>

        <tbody>    
            {cabins.map((cabin) => (
                <CabinRow
                key= {cabin.id}
                cabin= {cabin}
                onEdit= {onEdit}
                onDelete= {onDelete}
                />
            ))}
        </tbody>
        
      </table>
    </div>
        );
};

export default CabinTable;

        