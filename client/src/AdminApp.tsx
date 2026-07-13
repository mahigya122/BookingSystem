import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "react-hot-toast";
import { adminRouter } from "./app/adminRouter";
import { ThemeProvider } from "@shared/contexts/ThemeContext";
import { createQueryClient } from "@shared/services/queryClient";
import AdminLoadingFallback from "@shared/components/ui/AdminLoadingFallback";
import { supabase } from "@shared/services/supabase";

const queryClient = createQueryClient();

const RealtimeListener = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Initializing Supabase Realtime listener for bookings...");
    const channel = supabase
      .channel("admin-bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log("Realtime booking update received:", payload);
          
          // Invalidate bookings lists
          void queryClient.invalidateQueries({ queryKey: ["bookings"] });
          // Invalidate dashboard stats
          void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          // Invalidate cabin availability
          void queryClient.invalidateQueries({ queryKey: ["cabin-availability"] });
          void queryClient.invalidateQueries({ queryKey: ["cabins-with-bookings"] });

          // Toast notifications for booking changes
          if (payload.eventType === "INSERT") {
            toast("New reservation received! 🏨", {
              duration: 5000,
              icon: "🔔",
            });
          } else if (payload.eventType === "UPDATE") {
            const oldRow = payload.old as any;
            const newRow = payload.new as any;
            
            if (newRow.status === "cancelling" && oldRow?.status !== "cancelling") {
              toast.error("Guest requested a booking cancellation ⚠️", {
                duration: 6000,
              });
            } else if (newRow.status === "cancelled" && oldRow?.status !== "cancelled") {
              toast.error("Reservation has been cancelled.", {
                duration: 5000,
              });
            }
          }
        }
      );

    channel.subscribe((status, err) => {
      console.log(`Supabase Realtime subscription status: ${status}`, err || "");
    });

    return () => {
      console.log("Cleaning up Supabase Realtime listener...");
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return null;
};

function AdminApp() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RealtimeListener />
        <Suspense fallback={<AdminLoadingFallback />}>
          <RouterProvider router={adminRouter} />
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

export default AdminApp;
