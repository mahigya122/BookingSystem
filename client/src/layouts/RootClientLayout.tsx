import { Outlet } from "react-router-dom";
import { CabinFiltersProvider } from "../domains/cabins/contexts/CabinFiltersContext";

const RootClientLayout = () => {
  return (
    <CabinFiltersProvider>
      <Outlet />
    </CabinFiltersProvider>
  );
};

export default RootClientLayout;
