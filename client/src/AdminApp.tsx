import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { adminRouter } from "./app/adminRouter";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { createQueryClient } from "@shared/services/queryClient";
import AdminLoadingFallback from "@shared/components/ui/AdminLoadingFallback";

const queryClient = createQueryClient();

function AdminApp() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<AdminLoadingFallback />}>
          <RouterProvider router={adminRouter} />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
          }}
        />
      </QueryClientProvider>
    </ThemeProvider >
  );
}

export default AdminApp;
