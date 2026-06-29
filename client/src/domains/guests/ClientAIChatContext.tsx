/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";

interface ClientAIChatContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const ClientAIChatContext = createContext<ClientAIChatContextType | undefined>(undefined);

export const ClientAIChatProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <ClientAIChatContext.Provider value={{ open, setOpen }}>
      {children}
    </ClientAIChatContext.Provider>
  );
};

export const useClientAIChat = () => {
  const context = useContext(ClientAIChatContext);

  if (!context) {
    throw new Error("useClientAIChat must be used within a ClientAIChatProvider");
  }

  return context;
};
