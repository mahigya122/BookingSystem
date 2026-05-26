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
  <div className="space-y-8 animate-slide-up"> 
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Units & Cabins</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your property inventory and pricing.</p>
      </div>
  </div>

  <CabinSubnav
  onFilterChange = {setFilter}
  onSortChange = {setSort}
  currentSort={sort}
  onAddCabin = {() => setShowCreate(true)}
  />

  <div className="card overflow-hidden">
      <CabinTable
      cabins={paginatedData}
      onDelete={handleDelete}
      onEdit={setEditingCabin}
      onView={setSelectedCabin}
      />

      <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
          <CabinPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          />
      </div>
  </div>

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