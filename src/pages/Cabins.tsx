import { useState } from "react";

import { useCabins } from "../authentication/useCabins";
import { useDeleteCabin } from "../authentication/useDeleteCabin";

import CabinSubnav from "../components/cabin/CabinSubnav";
import CabinTable from "../components/cabin/CabinTable";
import CabinPagination from "../components/cabin/CabinPagination";
import CreateCabinModal from "../components/cabin/CreateCabinModal";
import EditCabinModal from "../components/cabin/EditCabinModal";
import CabinDetailModal from "../components/cabin/CabinDetailModal";

import { useFilteredCabins } from "../hooks/useFilteredCabins";
import { usePagination } from "../hooks/usePagination";
import type { Cabin as CabinType } from "../types/cabin";

const Cabins = () => {
  const { cabins = [], isLoading } = useCabins();

  const { removeCabin } = useDeleteCabin();

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const [showCreate, setShowCreate] = useState(false);

  const [editingCabin, setEditingCabin] = useState<CabinType | null>(null);
  const [selectedCabin, setSelectedCabin] = useState<CabinType | null>(null);

  const filteredCabins = useFilteredCabins(
    cabins, 
    filter,
    sort
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredCabins);

  const handleDelete = (id: string) => {
    const conformDelete = confirm(
      "Delete this cabin?"
    );

  if (!conformDelete) return;
  removeCabin(id);  
  };

  if (isLoading) {
    return <p>Loading Cabins.....</p>
  }

return (
  <div className="space-y-6"> 
  <h1 className= "text-3xl font-bold">Cabins</h1>

  <CabinSubnav
  onFilterChange = {setFilter}
  onSortChange = {setSort}
  currentSort={sort}
  onAddCabin = {() => setShowCreate(true)}
  />

  <CabinTable
  cabins={paginatedData}
  onDelete={handleDelete}
  onEdit={setEditingCabin}
  onView={setSelectedCabin}
  />

  <CabinPagination
  currentPage={currentPage}
  totalPages={totalPages}
  setCurrentPage={setCurrentPage}
  />

  {showCreate && (
    <CreateCabinModal
    onClose={() => setShowCreate(false)}
    />
  )}
  { editingCabin && (
    <EditCabinModal
    cabin= {editingCabin}
    onClose= {() => setEditingCabin(null)}
    />
  )}
  {selectedCabin && (
  <CabinDetailModal
    cabin={selectedCabin}
    onClose={() => setSelectedCabin(null)}
  />
)}
  </div>
);
};
export default Cabins;