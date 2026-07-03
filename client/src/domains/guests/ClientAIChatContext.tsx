/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";

export type ChatTab = "ai" | "support";

interface ClientAIChatContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: ChatTab;
  setActiveTab: Dispatch<SetStateAction<ChatTab>>;
}

const ClientAIChatContext = createContext<ClientAIChatContextType | undefined>(
  undefined,
);

export const ClientAIChatProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatTab>("ai");

  return (
    <ClientAIChatContext.Provider
      value={{ open, setOpen, activeTab, setActiveTab }}
    >
      {children}
    </ClientAIChatContext.Provider>
  );
};

export const useClientAIChat = () => {
  const context = useContext(ClientAIChatContext);

  if (!context) {
    throw new Error(
      "useClientAIChat must be used within a ClientAIChatProvider",
    );
  }

  return context;
};
