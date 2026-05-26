import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface AIChatContextType {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const AIChatContext = createContext<AIChatContextType | undefined>(undefined);

export const AIChatProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);

    return (
        <AIChatContext.Provider value={{ open, setOpen }}>
            {children}
        </AIChatContext.Provider>
    );
};

export function useAIChat() {
    const context = useContext(AIChatContext);

    if (!context) {
        throw new Error("useAIChat must be used within an AIChatProvider");
    }

    return context;
}
