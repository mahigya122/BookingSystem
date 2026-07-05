/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";
import { useUser } from "@shared/hooks";
import { useGuestUnreadSupportCount } from "@shared/hooks/useGuestUnreadSupportCount";

export type ChatTab = "ai" | "support";

interface ClientAIChatContextType {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  activeTab: ChatTab;
  setActiveTab: Dispatch<SetStateAction<ChatTab>>;
  unreadSupportCount: number;
  pendingSupportMessage: string | null;
  setPendingSupportMessage: Dispatch<SetStateAction<string | null>>;
}

const ClientAIChatContext = createContext<ClientAIChatContextType | undefined>(undefined);

export const ClientAIChatProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatTab>("ai");
  const [pendingSupportMessage, setPendingSupportMessage] = useState<string | null>(null);
  const { user } = useUser();
  const unreadSupportCount = useGuestUnreadSupportCount(user?.id ?? null);

  useEffect(() => {
    console.log("[ClientAIChatProvider] user:", user?.id, "unreadSupportCount:", unreadSupportCount);
  }, [user, unreadSupportCount]);

  return (
    <ClientAIChatContext.Provider value={{ open, setOpen, activeTab, setActiveTab, unreadSupportCount, pendingSupportMessage, setPendingSupportMessage }}>
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
