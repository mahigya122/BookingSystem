import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { router } from "./app/router";
import { initializeData } from "./data/initData";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { ThemeProvider } from "./Context/ThemeContext";
import { AIChatProvider } from "./Context/AIChatContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

async function bootstrap() {
  await initializeData();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <AIChatProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
              }}
            />
          </QueryClientProvider>
      </AIChatProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

void bootstrap();