import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import { router } from "./app/router";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { createQueryClient } from "@shared/services/queryClient";
import ClientLoadingFallback from "@shared/components/ui/ClientLoadingFallback";
import { supabase } from "@shared/services/supabase";

const queryClient = createQueryClient();

const RealtimeListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("guest-bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Guest realtime update:", payload);
          void queryClient.invalidateQueries({ queryKey: ["bookings"] });
          void queryClient.invalidateQueries({ queryKey: ["cabin-availability"] });
          void queryClient.invalidateQueries({ queryKey: ["cabins-with-bookings"] });

          if (payload.eventType === "UPDATE") {
            const oldRow = payload.old as any;
            const newRow = payload.new as any;
            if (newRow.status === "cancelled" && oldRow?.status !== "cancelled") {
              toast.success("Your reservation has been cancelled & refunded! 💸");
            }
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return null;
};

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RealtimeListener />
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
