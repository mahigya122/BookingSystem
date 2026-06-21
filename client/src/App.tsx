import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { router } from "./app/router";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { createQueryClient } from "@shared/services/queryClient";
import { CabinFiltersProvider } from "./domains/cabins/contexts/CabinFiltersContext";
import ClientLoadingFallback from "@shared/components/ui/ClientLoadingFallback";

const queryClient = createQueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CabinFiltersProvider>
          <Suspense fallback={<ClientLoadingFallback />}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
            }}
          />
        </CabinFiltersProvider>
      </QueryClientProvider>
    </ThemeProvider >
  );
}

export default App;
