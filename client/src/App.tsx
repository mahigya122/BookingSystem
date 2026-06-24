import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { router } from "./app/router";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { createQueryClient } from "@shared/services/queryClient";
import ClientLoadingFallback from "@shared/components/ui/ClientLoadingFallback";

const queryClient = createQueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<ClientLoadingFallback />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "var(--app-surface-elevated)",
              color: "var(--app-text-main)",
              border: "2px solid var(--app-border)",
              boxShadow: "var(--shadow-dropdown)",
              borderRadius: "1.25rem",
              padding: "14px 22px",
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontSize: "13.5px",
              fontWeight: "800",
              letterSpacing: "-0.01em",
            },
            success: {
              iconTheme: {
                primary: "var(--app-primary)",
                secondary: "var(--app-surface-elevated)",
              },
            },
            error: {
              iconTheme: {
                primary: "#f43f5e",
                secondary: "var(--app-surface-elevated)",
              },
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider >
  );
}

export default App;
