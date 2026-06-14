import CabinRow from "./CabinRow";
import type { CabinDetailSection } from "./CabinRow";
import type { Cabin } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";

interface Props{
    cabins: Cabin[];
    onEdit: (cabin: Cabin) => void;
    onDelete: (id: string) => void;
    onView: (cabin: Cabin, section?: CabinDetailSection) => void;
    activeBookingByCabinId: Record<string, Booking>;
}

const CabinTable = ({
    cabins,
    onEdit,
    onDelete,
    onView,
    activeBookingByCabinId,
}: Props) => {

return(
    <div className="overflow-x-auto">
        <table>
            <thead>
                <tr>
                    <th className="w-20">Media</th>
                    <th>Unit Name</th>
                    <th>Location</th>
                    <th>Max Cap.</th>
                    <th>Base Price</th>
                    <th>Discount</th>
                    <th>Offers</th>
                    <th>Activities</th>
                    <th>Reviews</th>
                    <th className="text-right" style={{ width: "15rem" }}>Manage</th>
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
                    activeBooking={activeBookingByCabinId[cabin.id] ?? null}
                    />
                ))}
            </tbody>
        </table>
    </div>
);
};

export default CabinTable;
