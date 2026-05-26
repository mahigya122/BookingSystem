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
    <div className="overflow-x-auto">
        <table>
            <thead>
                <tr>
                    <th className="w-20">Media</th>
                    <th>Unit Name</th>
                    <th>Max Cap.</th>
                    <th>Base Price</th>
                    <th>Discount</th>
                    <th className="text-right">Manage</th>
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
