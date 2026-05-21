import { useState } from "react";
import type { GuestSortType } from "../../types/guest";

interface Props {
  onSearchChange: (val: string) => void;
  onSortChange: (val: GuestSortType) => void;
  currentSort: GuestSortType;
  onAddGuest: () => void;
}

export default function GuestSubnav({ 
  onSearchChange, 
  onSortChange, 
  currentSort, 
  onAddGuest 
}: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const sortLabel = (s: GuestSortType) => {
    switch (s) {
      case "recent":
        return "Recently Added";
      case "earlier":
        return "Earlier";
      case "name-az":
        return "Name A-Z";  
      case "name-za":        
        return "Name Z-A";  

      default:
        return "Sort";  
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-3 border-b bg-white">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">

      <button
        onClick={onAddGuest}
        className="px-3 py-2 bg-indigo-600 text-white rounded-lg"
      >
        + Add Guest
      </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <input 
        value={search}
        onChange={(e) => {
        setSearch(e.target.value);
        onSearchChange(e.target.value);
        }}
        placeholder="Search guests..."
        className="border py-2 px-3 rounded-lg text-sm"
      />

      <div className="relative">
        <button
        onClick = {() => setOpen((p) => !p)}
        className="px-3 py-2 border rounded-lg"
        >
          {sortLabel(currentSort)} ▾
        </button>

        {open && (
          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow w-40">

            <button
            onClick = {() => onSortChange("recent")}
            className="block w-full px-3 py-2 hover:bg-gray-100"
            >
              Recent
            </button>

            <button
            onClick = {() => onSortChange("earlier")}
            className="block w-full px-3 py-2 hover:bg-gray-100"
            >
              Earlier
            </button>

            <button
            onClick = {() => onSortChange("name-az")}
            className="block w-full px-3 py-2 hover:bg-gray-100"
            >
              Name A-Z
            </button>

            <button
            onClick = {() => onSortChange("name-za")}
            className="block w-full px-3 py-2 hover:bg-gray-100"
            >
              Name Z-A
            </button>
            </div>
        )}
      </div>
    </div>
    </div>
  );
};