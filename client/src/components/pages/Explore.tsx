import { useOutletContext } from "react-router-dom";
import CabinCard from "../components/CabinCard";
import { useCabins } from "@shared/auth_hooks";

const Explore = () => {
    const { cabins = [] } = useCabins();
    const { filters } = useOutletContext<any>();

    const filtered = cabins.filter((cabin) => {
        const priceMatch =
            cabin.price_per_night >= filters.price[0] &&
            cabin.price_per_night <= filters.price[1];

        const capacityMatch =
            !filters.capacity || cabin.capacity >= filters.capacity;

        return priceMatch && capacityMatch;
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Explore Cabins</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((cabin) => (
                    <CabinCard key={cabin.id} cabin={cabin} />
                ))}
            </div>
        </div>
    );
};

export default Explore;